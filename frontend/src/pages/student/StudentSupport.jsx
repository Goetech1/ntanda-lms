import { useState, useEffect } from 'react';
import { LifeBuoy, Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, X, Send } from 'lucide-react';
import { supportService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const StudentSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Ticket Form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected ticket for modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await supportService.getStudentTickets();
      setTickets(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    setIsSubmitting(true);
    try {
      await supportService.createTicket({ subject, description, priority });
      setIsCreating(false);
      setSubject('');
      setDescription('');
      setPriority('normal');
      fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket", error);
      alert("Failed to submit ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setIsRepliesLoading(true);
    try {
      const res = await supportService.getTicket(ticket.id);
      setTicketReplies(res.data.data.replies || []);
    } catch (error) {
      console.error("Failed to fetch replies", error);
      setTicketReplies([]);
    } finally {
      setIsRepliesLoading(false);
    }
  };

  const handleReply = async () => {
    if (!newReply.trim() || !selectedTicket) return;
    setIsSubmitting(true);
    try {
      await supportService.replyTicket(selectedTicket.id, { message: newReply });
      setTicketReplies([...ticketReplies, { 
        id: Date.now().toString(), 
        message: newReply, 
        user_id: user?.id, 
        first_name: user?.firstName, 
        last_name: user?.lastName, 
        created_at: new Date().toISOString() 
      }]);
      setNewReply('');
    } catch (error) {
      console.error("Failed to reply", error);
      alert("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open': return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Open</span>;
      case 'in_progress': return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> In Progress</span>;
      case 'resolved': return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      default: return null;
    }
  };

  const filteredTickets = tickets.filter(t => t.subject.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <LifeBuoy className="h-8 w-8 text-[var(--primary)]" />
            Support Helpdesk
          </h1>
          <p className="text-slate-400 mt-2 text-lg">We're here to help. View your past tickets or open a new one.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Open New Ticket
          </button>
        )}
      </div>

      {isCreating ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="border-b border-slate-800 flex flex-row justify-between items-center">
            <CardTitle>Submit a Support Ticket</CardTitle>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe your issue"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="low">Low - General Question</option>
                  <option value="normal">Normal - Standard Support</option>
                  <option value="high">High - Blocking Issue</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide as much detail as possible..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[120px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !subject || !description}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit Ticket
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search your tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800/50">
                {isLoading ? (
                  <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" /></div>
                ) : filteredTickets.length === 0 ? (
                  <div className="p-12 text-center">
                    <LifeBuoy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No tickets found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">You haven't opened any support tickets yet, or none match your search.</p>
                  </div>
                ) : (
                  filteredTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => handleOpenTicket(ticket)}
                      className="p-5 hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(ticket.status)}
                          <span className="text-xs text-slate-500">#{ticket.id.substring(0,8)}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors">{ticket.subject}</h3>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">{ticket.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-slate-500 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge(selectedTicket.status)}
                  <span className="text-xs text-slate-500">#{selectedTicket.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                <p className="text-sm text-slate-400 mt-1">Opened on {new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 custom-scrollbar">
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-[var(--primary)]/20 text-[var(--primary)]">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="rounded-2xl p-4 text-sm max-w-[85%] bg-[var(--primary)] text-white rounded-tr-none border border-[var(--primary)]">
                    {selectedTicket.description}
                  </div>
                </div>
              </div>

              {isRepliesLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>
              ) : (
                ticketReplies.map((reply, idx) => {
                  const isMe = reply.user_id === user?.id;
                  return (
                    <div key={reply.id || idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${isMe ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-slate-800 text-slate-400'}`}>
                        {reply.first_name?.charAt(0)}{reply.last_name?.charAt(0) || 'A'}
                      </div>
                      <div className={`flex-1 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl p-4 text-sm max-w-[85%] border ${isMe ? 'bg-[var(--primary)] text-white rounded-tr-none border-[var(--primary)]' : 'bg-slate-800 text-slate-200 rounded-tl-none border-slate-700'}`}>
                          {reply.message}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
              {selectedTicket.status !== 'resolved' ? (
                <div className="flex gap-3">
                  <textarea 
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply to support..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[80px] resize-none"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={isSubmitting || !newReply.trim()}
                    className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl px-4 flex flex-col items-center justify-center gap-1 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="text-xs font-semibold">Send</span>
                  </button>
                </div>
              ) : (
                <div className="text-center p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-medium">
                  This ticket has been marked as resolved.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSupport;
