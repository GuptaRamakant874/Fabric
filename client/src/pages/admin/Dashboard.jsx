import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Briefcase, Wrench, Package, ArrowRight, Eye } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    newQuotes: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalProjects: 0,
    totalProducts: 0,
    totalServices: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [quotesRes, contactsRes, projectsRes, productsRes, servicesRes] = await Promise.all([
          API.getQuotes(),
          API.getContacts(),
          API.getProjects(),
          API.getProducts(),
          API.getServices(),
        ]);

        const quotes = quotesRes.data.data;
        const messages = contactsRes.data.data;
        const projects = projectsRes.data.data;
        const products = productsRes.data.data;
        const services = servicesRes.data.data;

        const newQuotesCount = quotes.filter((q) => q.status === 'New').length;
        const unreadMessagesCount = messages.filter((m) => m.status === 'Unread').length;

        setStats({
          totalQuotes: quotes.length,
          newQuotes: newQuotesCount,
          totalMessages: messages.length,
          unreadMessages: unreadMessagesCount,
          totalProjects: projects.length,
          totalProducts: products.length,
          totalServices: services.length,
        });

        // Set top 3 most recent for overview lists
        setRecentQuotes(quotes.slice(0, 3));
        setRecentMessages(messages.slice(0, 3));
      } catch (err) {
        console.error('Failed to load admin dashboard summary:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      subText: `${stats.newQuotes} unreviewed`,
      icon: <FileText className="h-6 w-6 text-sky-400" />,
      link: '/admin/quotes',
      badge: stats.newQuotes > 0 ? `${stats.newQuotes} New` : null,
    },
    {
      title: 'Contact Mail',
      value: stats.totalMessages,
      subText: `${stats.unreadMessages} unread`,
      icon: <Mail className="h-6 w-6 text-sky-400" />,
      link: '/admin/messages',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} Unread` : null,
    },
    {
      title: 'Portfolio Projects',
      value: stats.totalProjects,
      subText: 'Live on public page',
      icon: <Briefcase className="h-6 w-6 text-sky-400" />,
      link: '/admin/portfolio',
    },
    {
      title: 'Product Items',
      value: stats.totalProducts,
      subText: 'Catalogue entries',
      icon: <Package className="h-6 w-6 text-sky-400" />,
      link: '/admin/products',
    },
    {
      title: 'Services Active',
      value: stats.totalServices,
      subText: 'Capabilities listed',
      icon: <Wrench className="h-6 w-6 text-sky-400" />,
      link: '/admin/services',
    },
  ];

  return (
    <div className="space-y-10 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-white tracking-tight">
          Admin <span className="text-sky-400">Dashboard</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Welcome to the HPY Engineering control center. View recent quote bids and messages below.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-sky-500/40 hover:scale-[1.01] transition-all group shadow-xl"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {card.title}
              </span>
              <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors duration-200">
                {card.icon}
              </div>
            </div>

            {/* Value Info */}
            <div className="mt-4">
              <span className="block font-display font-black text-4xl text-white">
                {card.value}
              </span>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-slate-400 font-medium">{card.subText}</span>
                {card.badge && (
                  <span className="bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent submissions columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-400" /> Recent Quote Requests
            </h3>
            <Link
              to="/admin/quotes"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              All Quotes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((q) => (
                <div key={q._id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="truncate text-left space-y-1">
                    <p className="font-bold text-sm text-white truncate">
                      {q.name} <span className="text-xs text-slate-400 font-normal">({q.company || 'Private'})</span>
                    </p>
                    <p className="text-xs text-slate-300 truncate">
                      {q.projectType} &bull; Timeline: {q.timeline}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        q.status === 'New'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30'
                          : q.status === 'Reviewed'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-400/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                      }`}
                    >
                      {q.status}
                    </span>
                    <Link
                      to="/admin/quotes"
                      className="p-1.5 text-slate-400 hover:text-sky-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                      title="View quote"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6">No quote requests registered yet.</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-sky-400" /> Recent Contact Messages
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              All Messages <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentMessages.length > 0 ? (
              recentMessages.map((m) => (
                <div key={m._id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="truncate text-left space-y-1">
                    <p className="font-bold text-sm text-white truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-300 truncate italic">
                      "{m.message}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        m.status === 'Unread'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {m.status}
                    </span>
                    <Link
                      to="/admin/messages"
                      className="p-1.5 text-slate-400 hover:text-sky-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                      title="View message"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6">No contact messages received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
