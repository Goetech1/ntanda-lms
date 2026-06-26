import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { MessageSquare, Pin, CheckCircle, Send, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CourseDiscussion = ({ courseId }) => {
  const [forums, setForums] = useState([]);
  const [activeForum, setActiveForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadContent, setNewThreadContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/forums`);
        setForums(response.data);
        if (response.data.length > 0) {
          fetchThreads(response.data[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch forums:", error);
        setIsLoading(false);
      }
    };
    if (courseId) fetchForums();
  }, [courseId]);

  const fetchThreads = async (forumId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/forums/${forumId}`);
      setActiveForum(response.data.forum);
      setThreads(response.data.threads);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostThread = async (e) => {
    e.preventDefault();
    if (!newThreadContent.trim() || !activeForum) return;
    
    setIsPosting(true);
    try {
      const response = await api.post(`/forums/${activeForum.id}/posts`, {
        content: newThreadContent
      });
      // Prepend new thread
      setThreads([response.data, ...threads]);
      setNewThreadContent('');
    } catch (error) {
      console.error("Failed to post thread:", error);
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading && !activeForum) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar: Forums List */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 px-3">Discussion Boards</h3>
        {forums.map(forum => (
          <button
            key={forum.id}
            onClick={() => fetchThreads(forum.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group ${
              activeForum?.id === forum.id 
                ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium border border-[var(--primary)]/20' 
                : 'text-slate-700 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{forum.title}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeForum?.id === forum.id ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
              {forum.total_threads}
            </span>
          </button>
        ))}
      </div>

      {/* Main Area: Threads */}
      <div className="flex-1 min-w-0 flex flex-col h-[800px] border border-slate-200 rounded-xl bg-white/30 overflow-hidden">
        {activeForum ? (
          <>
            <div className="p-6 border-b border-slate-200 bg-white/50 backdrop-blur">
              <h2 className="text-xl font-bold text-white">{activeForum.title}</h2>
              {activeForum.description && <p className="text-slate-600 text-sm mt-1">{activeForum.description}</p>}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* New Thread Composer */}
              <form onSubmit={handlePostThread} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-lg focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all">
                <textarea
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Start a new discussion..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-500 resize-none outline-none min-h-[80px] text-sm"
                />
                <div className="flex justify-end pt-3 border-t border-slate-200/50 mt-2">
                  <Button type="submit" isLoading={isPosting} disabled={!newThreadContent.trim()} size="sm" className="shadow-md">
                    <Send className="h-4 w-4 mr-2" /> Post
                  </Button>
                </div>
              </form>

              {/* Thread List */}
              <div className="space-y-4">
                {threads.length > 0 ? (
                  threads.map(thread => (
                    <div key={thread.id} className="bg-white/50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <img src={thread.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.user?.full_name || 'User')}&background=0D8ABC&color=fff`} alt={thread.user?.full_name} className="h-10 w-10 rounded-full border border-slate-200" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{thread.user?.full_name}</span>
                              {thread.is_pinned && <Pin className="h-3 w-3 text-amber-500" />}
                              {thread.is_resolved && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                            </div>
                            <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{thread.content}</p>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center gap-4">
                        <button className="text-xs font-medium text-slate-600 hover:text-white flex items-center gap-1.5 transition-colors">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {thread.replies_count || 0} Replies
                        </button>
                        {/* More actions like Upvote could go here */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">No discussions yet</h3>
                    <p className="text-slate-500 mt-1">Be the first to start a conversation in this forum.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <MessageSquare className="h-12 w-12 mb-4 text-slate-700" />
            <p>Select a discussion board from the sidebar to view threads.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDiscussion;
