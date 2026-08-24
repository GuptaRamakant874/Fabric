import React, { useState, useEffect } from 'react';
import { Eye, FileText, Download, User, Building, ShieldAlert, X } from 'lucide-react';
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
        return 'bg-sky-500/15 text-sky-300 border border-sky-400/30';
      case 'Reviewed':
        return 'bg-blue-500/15 text-blue-300 border border-blue-400/30';
      case 'Contacted':
        return 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-white tracking-tight">
          Quote <span className="text-sky-400">Requests</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Review specification designs, budgets, and change the status of proposal inquiries.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {['All', 'New', 'Reviewed', 'Contacted'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
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
        <div className="bg-slate-900 border border-slate-800 overflow-hidden rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold tracking-wider">
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Project Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Drawing</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                {filteredQuotes.map((quote) => {
                  const submitDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={quote._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {submitDate}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        {quote.name}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {quote.company || 'Private'}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {quote.projectType}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${getStatusBadgeClass(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {quote.fileUrl ? (
                          <div className="inline-flex p-1.5 bg-sky-500/15 border border-sky-400/30 text-sky-300 rounded-lg" title="Drawing Available">
                            <Download className="h-4 w-4" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600">&mdash;</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
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
        <div className="text-center p-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          No quote requests found matching filter status '{statusFilter}'.
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-400" /> Quote Spec Details
              </h2>
              <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-sky-400 p-1.5 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              {/* Client Info Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400">Client Contact</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <User className="h-4 w-4 text-sky-400" /> {selectedQuote.name}
                  </div>
                  <p className="text-xs text-slate-300 ml-5">{selectedQuote.email} | {selectedQuote.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400">Company</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                    <Building className="h-4 w-4 text-sky-400" /> {selectedQuote.company || 'Private Project'}
                  </div>
                  <p className="text-xs text-slate-300 ml-5">Submitted on: {new Date(selectedQuote.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Estimate Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                  <span className="block text-[10px] font-bold text-slate-400">Timeline Bid</span>
                  <span className="block text-sm font-bold text-white mt-1">{selectedQuote.timeline || 'N/A'}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                  <span className="block text-[10px] font-bold text-slate-400">Target Budget</span>
                  <span className="block text-sm font-bold text-white mt-1">{selectedQuote.budgetRange || 'N/A'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400">Fabrication Description</span>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedQuote.description}
                </div>
              </div>

              {/* Files / Attachments */}
              {selectedQuote.fileUrl && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400">Blueprint Drawing Attachment</span>
                  <a
                    href={selectedQuote.fileUrl.startsWith('/uploads/') ? `${API_BASE_URL}${selectedQuote.fileUrl}` : selectedQuote.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500/15 border border-sky-400/30 text-sky-300 rounded-xl text-xs font-bold tracking-wide hover:bg-sky-500/25 transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Blueprint Drawing
                  </a>
                </div>
              )}

              {/* Action Dropdown / Status */}
              <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400">Current Request Status</span>
                  <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-lg mt-1.5 ${getStatusBadgeClass(selectedQuote.status)}`}>
                    {selectedQuote.status}
                  </span>
                </div>
                
                {/* Change Status Dropdown */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <label className="text-xs font-bold text-slate-300">Update To:</label>
                  <select
                    disabled={updatingId !== null}
                    value={selectedQuote.status}
                    onChange={(e) => handleUpdateStatus(selectedQuote._id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="New" className="bg-slate-950 text-white">New</option>
                    <option value="Reviewed" className="bg-slate-950 text-white">Reviewed</option>
                    <option value="Contacted" className="bg-slate-950 text-white">Contacted</option>
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
