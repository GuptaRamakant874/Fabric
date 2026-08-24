import React, { useState, useEffect } from 'react';
import { Eye, Mail, MailWarning, X, ShieldAlert } from 'lucide-react';
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
        <h1 className="font-display font-black text-3xl text-white tracking-tight">
          Contact <span className="text-sky-400">Messages</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Review general contact form inquiries sent from the public website contact portal.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Messages List Table */}
      {loading ? (
        <LoadingSpinner />
      ) : messages.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 overflow-hidden rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold tracking-wider">
                  <th className="py-4 px-6">Received</th>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Inquiry Preview</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
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
                      className={`cursor-pointer hover:bg-slate-800/50 transition-colors ${
                        msg.status === 'Unread' ? 'bg-sky-500/5 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {submitDate}
                      </td>
                      <td className={`py-4 px-6 ${msg.status === 'Unread' ? 'text-sky-300 font-black' : 'text-white font-bold'}`}>
                        {msg.name}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {msg.email}
                      </td>
                      <td className="py-4 px-6 text-slate-300 max-w-xs truncate italic">
                        "{msg.message}"
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                            msg.status === 'Unread'
                              ? 'bg-red-500/15 text-red-300 border border-red-500/30 font-black'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
                          title="Open Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {msg.status === 'Read' && (
                          <button
                            onClick={(e) => handleMarkUnread(msg._id, e)}
                            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
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
        <div className="text-center p-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          No contact messages registered.
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full my-8">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-400" /> Read Message
              </h2>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-sky-400 p-1.5 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 text-left">
              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="block text-[10px] font-bold text-slate-400">Sender Profile</span>
                <p className="text-sm font-bold text-white">{selectedMsg.name}</p>
                <p className="text-xs text-slate-300">{selectedMsg.email} {selectedMsg.phone ? `| ${selectedMsg.phone}` : ''}</p>
                <span className="text-[10px] text-slate-400 block pt-1">Received: {new Date(selectedMsg.createdAt).toLocaleString()}</span>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <span className="block text-[10px] font-bold text-slate-400">Message Content</span>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Close Panel */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedMsg(null)}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs tracking-wide rounded-xl shadow-md shadow-sky-500/25"
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
