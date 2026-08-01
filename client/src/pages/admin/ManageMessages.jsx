import React, { useState, useEffect } from 'react';
import { Eye, Mail, MailWarning, Trash2, X, ShieldAlert, Check } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await API.getContacts();
      setMessages(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMsg(msg);
    // If opening an unread message, mark it as read automatically
    if (msg.status === 'Unread') {
      try {
        const res = await API.updateContactStatus(msg._id, 'Read');
        const updatedMsg = res.data.data;
        // Update local list
        setMessages(messages.map((m) => (m._id === msg._id ? updatedMsg : m)));
      } catch (err) {
        console.warn('Could not mark message as read on server:', err.message);
      }
    }
  };

  const handleMarkUnread = async (id, e) => {
    e.stopPropagation(); // Avoid opening details modal
    try {
      const res = await API.updateContactStatus(id, 'Unread');
      setMessages(messages.map((m) => (m._id === id ? res.data.data : m)));
    } catch (err) {
      setErrorMsg('Failed to update message status.');
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
          Contact <span className="text-industrial-orange">Messages</span>
        </h1>
        <p className="text-sm text-industrial-muted mt-1">
          Review general contact form inquiries sent from the public website contact portal.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Messages List Table */}
      {loading ? (
        <LoadingSpinner />
      ) : messages.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-industrial-charcoal border-b border-industrial-border text-industrial-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Received</th>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Inquiry Preview</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border/30 text-sm">
                {messages.map((msg) => {
                  const submitDate = new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={msg._id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`cursor-pointer hover:bg-industrial-steel/10 transition-colors ${
                        msg.status === 'Unread' ? 'bg-industrial-orange/5 font-semibold' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-mono text-xs text-industrial-muted">
                        {submitDate}
                      </td>
                      <td className={`py-4 px-6 ${msg.status === 'Unread' ? 'text-industrial-orange font-bold' : 'text-industrial-light'}`}>
                        {msg.name}
                      </td>
                      <td className="py-4 px-6 text-industrial-muted">
                        {msg.email}
                      </td>
                      <td className="py-4 px-6 text-industrial-muted max-w-xs truncate italic">
                        "{msg.message}"
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            msg.status === 'Unread'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-industrial-steel/40 text-industrial-muted'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                          title="Open Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {msg.status === 'Read' && (
                          <button
                            onClick={(e) => handleMarkUnread(msg._id, e)}
                            className="p-1.5 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                            title="Mark as Unread"
                          >
                            <MailWarning className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-industrial-gray rounded-lg border border-dashed border-industrial-border text-industrial-muted">
          No contact messages registered.
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <h2 className="font-display font-black text-lg text-industrial-light uppercase flex items-center gap-2">
                <Mail className="h-5 w-5 text-industrial-orange" /> Read Message
              </h2>
              <button onClick={() => setSelectedMsg(null)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Sender Profile</span>
                <p className="text-sm font-bold text-industrial-light">{selectedMsg.name}</p>
                <p className="text-xs text-industrial-muted">{selectedMsg.email} {selectedMsg.phone ? `| ${selectedMsg.phone}` : ''}</p>
                <span className="text-[10px] text-industrial-muted/80 block pt-1">Received: {new Date(selectedMsg.createdAt).toLocaleString()}</span>
              </div>

              <div className="space-y-2 border-t border-industrial-border/60 pt-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Message Content</span>
                <div className="bg-industrial-charcoal border border-industrial-border/60 p-4 rounded text-sm text-industrial-light whitespace-pre-wrap leading-relaxed">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Close Panel */}
              <div className="pt-4 border-t border-industrial-border/60 flex justify-end">
                <button
                  onClick={() => setSelectedMsg(null)}
                  className="px-5 py-2 bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider rounded"
                >
                  Close Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
