import React, { useState, useEffect } from 'react';
import { Eye, Check, X, FileText, Download, User, Building, Calendar, Info, ShieldAlert } from 'lucide-react';
import API, { API_BASE_URL } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Selected Quote Modal
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter((q) => q.status === statusFilter));
    }
  }, [statusFilter, quotes]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await API.getQuotes();
      setQuotes(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load quote requests list.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setErrorMsg(null);
    try {
      const res = await API.updateQuoteStatus(id, newStatus);
      const updatedQuote = res.data.data;
      
      // Update local lists
      setQuotes(quotes.map((q) => (q._id === id ? updatedQuote : q)));
      if (selectedQuote && selectedQuote._id === id) {
        setSelectedQuote(updatedQuote);
      }
    } catch (err) {
      setErrorMsg('Could not update status of the request.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-industrial-orange/15 text-industrial-orange border border-industrial-orange/30';
      case 'Reviewed':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
      case 'Contacted':
        return 'bg-green-500/15 text-green-400 border border-green-500/20';
      default:
        return 'bg-industrial-steel/40 text-industrial-light';
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
          Quote <span className="text-industrial-orange">Requests</span>
        </h1>
        <p className="text-sm text-industrial-muted mt-1">
          Review specification designs, budgets, and change the status of proposal inquiries.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-industrial-border/40 pb-4">
        {['All', 'New', 'Reviewed', 'Contacted'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-industrial-orange text-industrial-charcoal font-black'
                : 'bg-industrial-steel/20 border border-industrial-border/60 text-industrial-muted hover:text-industrial-light'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredQuotes.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-industrial-charcoal border-b border-industrial-border text-industrial-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Project Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Drawing</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border/30 text-sm">
                {filteredQuotes.map((quote) => {
                  const submitDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={quote._id} className="hover:bg-industrial-steel/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-industrial-muted">
                        {submitDate}
                      </td>
                      <td className="py-4 px-6 font-bold text-industrial-light">
                        {quote.name}
                      </td>
                      <td className="py-4 px-6 text-industrial-muted">
                        {quote.company || 'Private'}
                      </td>
                      <td className="py-4 px-6">
                        {quote.projectType}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusBadgeClass(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {quote.fileUrl ? (
                          <div className="inline-flex p-1 bg-industrial-orange/10 border border-industrial-orange/20 text-industrial-orange rounded">
                            <Download className="h-4 w-4" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-industrial-muted">&mdash;</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                          title="Open Specifications Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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
          No quote requests found matching filter status '{statusFilter}'.
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-2xl w-full my-8">
            {/* Header */}
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <h2 className="font-display font-black text-lg text-industrial-light uppercase flex items-center gap-2">
                <FileText className="h-5 w-5 text-industrial-orange" /> Quote Spec Details
              </h2>
              <button onClick={() => setSelectedQuote(null)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              {/* Client Info Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-industrial-charcoal border border-industrial-border p-4 rounded-lg">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Client Contact</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-industrial-light">
                    <User className="h-4 w-4 text-industrial-orange" /> {selectedQuote.name}
                  </div>
                  <p className="text-xs text-industrial-muted ml-5">{selectedQuote.email} | {selectedQuote.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Company</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-industrial-light">
                    <Building className="h-4 w-4 text-industrial-orange" /> {selectedQuote.company || 'Private Project'}
                  </div>
                  <p className="text-xs text-industrial-muted ml-5">Submitted on: {new Date(selectedQuote.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Estimate Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-industrial-charcoal border border-industrial-border/60 p-3 rounded">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Timeline Bid</span>
                  <span className="block text-sm font-bold text-industrial-light mt-1">{selectedQuote.timeline || 'N/A'}</span>
                </div>
                <div className="bg-industrial-charcoal border border-industrial-border/60 p-3 rounded">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Target Budget</span>
                  <span className="block text-sm font-bold text-industrial-light mt-1">{selectedQuote.budgetRange || 'N/A'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Fabrication Description</span>
                <div className="bg-industrial-charcoal border border-industrial-border/60 p-4 rounded text-sm text-industrial-light whitespace-pre-wrap leading-relaxed">
                  {selectedQuote.description}
                </div>
              </div>

              {/* Files / Attachments */}
              {selectedQuote.fileUrl && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Blueprint Drawing Attachment</span>
                  <a
                    href={selectedQuote.fileUrl.startsWith('/uploads/') ? `${API_BASE_URL}${selectedQuote.fileUrl}` : selectedQuote.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-industrial-steel/40 border border-industrial-border text-industrial-orange rounded text-xs font-bold uppercase tracking-wider hover:bg-industrial-steel transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Blueprint Drawing
                  </a>
                </div>
              )}

              {/* Action Dropdown / Status */}
              <div className="border-t border-industrial-border/60 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted">Current Request Status</span>
                  <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mt-1.5 ${getStatusBadgeClass(selectedQuote.status)}`}>
                    {selectedQuote.status}
                  </span>
                </div>
                
                {/* Change Status Dropdown */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <label className="text-xs font-bold uppercase tracking-wider text-industrial-muted">Update To:</label>
                  <select
                    disabled={updatingId !== null}
                    value={selectedQuote.status}
                    onChange={(e) => handleUpdateStatus(selectedQuote._id, e.target.value)}
                    className="bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-xs font-bold text-industrial-light focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuotes;
