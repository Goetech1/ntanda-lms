import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, Loader2, User as UserIcon, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useTenantBranding } from '../../components/TenantBrandingProvider';

const StudentChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef(null);
  const { tenant } = useTenantBranding();
  const pollingInterval = useRef(null);

  useEffect(() => {
    fetchConversations();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      startPolling(activeConversation.id);
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startPolling = (conversationId) => {
    stopPolling();
    pollingInterval.current = setInterval(() => {
      // Background fetch without showing loader
      api.get(`/chat/${conversationId}/messages`)
        .then(res => setMessages(res.data))
        .catch(err => console.error("Polling error", err));
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
  };

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/chat/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const searchUsers = async (query) => {
    setIsSearching(true);
    try {
      const response = await api.get(`/chat/search-users?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      const response = await api.post('/chat/start', { user_id: userId });
      const conv = response.data;
      setSearchQuery('');
      setSearchResults([]);
      
      // Refresh conversations list and set active
      await fetchConversations();
      // Find the newly created/fetched conversation from the list or just use response
      setActiveConversation(conv);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Could not start conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setIsSending(true);
    try {
      const response = await api.post(`/chat/${activeConversation.id}/messages`, {
        content: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Update the conversations list to show latest message snippet
      fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getOtherUser = (conv) => {
    if (!conv || !conv.users || conv.users.length === 0) return null;
    return conv.users[0]; // Assuming API returns users excluding the current user
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-up">
      
      {/* Sidebar - Conversations & Search */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0 h-full">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
            Messages
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search people to chat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute z-10 w-[calc(100%-2rem)] mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-slate-500 flex justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleStartConversation(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-left transition-colors"
                  >
                    <img 
                      src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                      className="w-8 h-8 rounded-full"
                      alt={user.full_name}
                    />
                    <div>
                      <div className="font-medium text-sm text-slate-800">{user.full_name}</div>
                      <div className="text-xs text-slate-500 capitalize">{user.role?.name?.toLowerCase()}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">No users found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-sm">
              <UserIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              No conversations yet.<br/>Search for someone to start chatting!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map(conv => {
                const otherUser = getOtherUser(conv);
                const lastMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
                const isActive = activeConversation?.id === conv.id;
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isActive ? 'bg-blue-50 border-l-4 border-[var(--primary)]' : 'hover:bg-slate-100 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.full_name || 'U')}&background=random`} 
                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                        alt={otherUser?.full_name}
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-bold text-slate-800 truncate text-sm">{otherUser?.full_name || 'Unknown User'}</h3>
                        {lastMessage && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(lastMessage.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-[var(--primary)] font-medium' : 'text-slate-500'}`}>
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src={getOtherUser(activeConversation)?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherUser(activeConversation)?.full_name || 'U')}&background=random`} 
                  className="w-10 h-10 rounded-full object-cover shadow-sm"
                  alt="User"
                />
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{getOtherUser(activeConversation)?.full_name}</h3>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                    Active in {tenant?.name || 'Institution'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => {
                    const isMine = msg.sender_id !== getOtherUser(activeConversation)?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          isMine 
                            ? 'bg-[var(--primary)] text-white rounded-br-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div className={`text-[10px] mt-1 text-right ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none min-h-[50px] max-h-32"
                  rows={1}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="bg-[var(--primary)] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400">Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-50 h-full">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 relative">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <div className="absolute -right-2 -bottom-2 bg-blue-100 p-2 rounded-full">
                <Search className="w-4 h-4 text-[var(--primary)]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Your Messages</h3>
            <p className="text-slate-500 max-w-sm text-center">
              Select a conversation from the sidebar or search for someone to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentChat;
