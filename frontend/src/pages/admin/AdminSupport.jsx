import { useState, useEffect } from 'react';
import { LifeBuoy, Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, X, Send, Loader2 } from 'lucide-react';
import { supportService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';

const AdminSupport = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selected ticket for modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await supportService.getAdminTickets();
      setTickets(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      // Demo fallback
      setTickets([
        { id: '1', subject: 'Cannot access course materials', description: 'When I click on Module 2 it says access denied.', status: 'open', priority: 'high', created_at: new Date().toISOString(), first_name: 'John', last_name: 'Doe' },
        { id: '2', subject: 'Certificate name is incorrect', description: 'My name is misspelled on the certificate.', status: 'in_progress', priority: 'normal', created_at: new Date(Date.now() - 86400000).toISOString(), first_name: 'Jane', last_name: 'Smith' },
        { id: '3', subject: 'Billing question', description: 'Can I get a refund for the UI/UX course?', status: 'resolved', priority: 'low', created_at: new Date(Date.now() - 172800000).toISOString(), first_name: 'Alice', last_name: 'Johnson' },
      ]);
    } finally {
      setIsLoading(false);
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
      // Optimistically add to list
      setTicketReplies([...ticketReplies, { 
        id: Date.now().toString(), 
        message: newReply, 
        user_id: user?.id, 
        first_name: user?.firstName || 'Admin', 
        last_name: user?.lastName || '', 
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

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      await supportService.updateStatus(selectedTicket.id, newStatus);
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Failed to update status", error);
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

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.first_name + ' ' + t.last_name).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-[var(--primary)]" /> Support Helpdesk
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and resolve student support requests.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search tickets by subject or student name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white focus:outline-none appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/50">
            {isLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" /></div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No tickets found.</div>
            ) : (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => handleOpenTicket(ticket)}
                  className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {getStatusBadge(ticket.status)}
                      <span className="text-xs text-slate-500">#{ticket.id.substring(0,8)}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-[var(--primary)] transition-colors">{ticket.subject}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{ticket.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="text-slate-300 font-medium">{ticket.first_name} {ticket.last_name}</p>
                      <p className="text-slate-500 text-xs">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

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
                <p className="text-sm text-slate-400 mt-1">
                  Opened by <span className="font-medium text-slate-300">{selectedTicket.first_name} {selectedTicket.last_name}</span> on {new Date(selectedTicket.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 custom-scrollbar">
              {/* Original Ticket Description */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-400 text-sm">
                  {selectedTicket.first_name?.charAt(0)}{selectedTicket.last_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-200 text-sm border border-slate-700">
                    {selectedTicket.description}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {isRepliesLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>
              ) : (
                ticketReplies.map((reply, idx) => {
                  const isAdmin = reply.user_id === user?.id || !reply.last_name; // Rough check for demo
                  return (
                    <div key={reply.id || idx} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${isAdmin ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-slate-800 text-slate-400'}`}>
                        {reply.first_name?.charAt(0)}{reply.last_name?.charAt(0) || 'A'}
                      </div>
                      <div className={`flex-1 flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl p-4 text-sm max-w-[85%] border ${isAdmin ? 'bg-[var(--primary)] text-white rounded-tr-none border-[var(--primary)]' : 'bg-slate-800 text-slate-200 rounded-tl-none border-slate-700'}`}>
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
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-slate-400">Change Status:</span>
                <select 
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {selectedTicket.status !== 'resolved' ? (
                <div className="flex gap-3">
                  <textarea 
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply to the student..."
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

export default AdminSupport;
