import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Briefcase, Wrench, Package, Clock, ArrowRight, Eye, ShieldCheck, MailWarning } from 'lucide-react';
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
      icon: <FileText className="h-6 w-6 text-industrial-orange" />,
      link: '/admin/quotes',
      badge: stats.newQuotes > 0 ? `${stats.newQuotes} NEW` : null,
    },
    {
      title: 'Contact Mail',
      value: stats.totalMessages,
      subText: `${stats.unreadMessages} unread`,
      icon: <Mail className="h-6 w-6 text-industrial-orange" />,
      link: '/admin/messages',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} UNREAD` : null,
    },
    {
      title: 'Portfolio Projects',
      value: stats.totalProjects,
      subText: 'Live on public page',
      icon: <Briefcase className="h-6 w-6 text-industrial-orange" />,
      link: '/admin/portfolio',
    },
    {
      title: 'Product Items',
      value: stats.totalProducts,
      subText: 'Catalogue entries',
      icon: <Package className="h-6 w-6 text-industrial-orange" />,
      link: '/admin/products',
    },
    {
      title: 'Services Active',
      value: stats.totalServices,
      subText: 'Capabilities listed',
      icon: <Wrench className="h-6 w-6 text-industrial-orange" />,
      link: '/admin/services',
    },
  ];

  return (
    <div className="space-y-10 text-left">
      {/* Title */}
      <div>
        <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
          Admin <span className="text-industrial-orange">Dashboard</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome to the HPY Engineering control center. View recent quote bids and messages below.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="glass-panel p-6 rounded-lg relative overflow-hidden flex flex-col justify-between hover:border-industrial-orange/30 hover:scale-[1.01] transition-all group"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-industrial-muted">
                {card.title}
              </span>
              <div className="bg-industrial-charcoal border border-industrial-border/60 p-2.5 rounded-lg group-hover:bg-industrial-orange group-hover:text-industrial-charcoal transition-colors duration-200">
                {card.icon}
              </div>
            </div>

            {/* Value Info */}
            <div className="mt-4">
              <span className="block font-display font-black text-4xl text-industrial-light">
                {card.value}
              </span>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-industrial-muted">{card.subText}</span>
                {card.badge && (
                  <span className="bg-industrial-orange/15 text-industrial-orange font-bold px-2 py-0.5 rounded text-[10px] uppercase">
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
        <div className="glass-panel p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-industrial-border/60 pb-3">
            <h3 className="font-display font-black text-lg text-industrial-light flex items-center gap-2">
              <FileText className="h-5 w-5 text-industrial-orange" /> Recent Quote Requests
            </h3>
            <Link
              to="/admin/quotes"
              className="text-xs font-bold uppercase tracking-wider text-industrial-orange hover:underline flex items-center gap-0.5"
            >
              All Quotes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-industrial-border/30">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((q) => (
                <div key={q._id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="truncate text-left space-y-1">
                    <p className="font-semibold text-sm text-industrial-light truncate">
                      {q.name} <span className="text-xs text-industrial-muted font-normal">({q.company || 'Private'})</span>
                    </p>
                    <p className="text-xs text-industrial-muted truncate">
                      {q.projectType} &bull; Timeline: {q.timeline}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                        q.status === 'New'
                          ? 'bg-industrial-orange/15 text-industrial-orange border border-industrial-orange/30'
                          : q.status === 'Reviewed'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                          : 'bg-green-500/15 text-green-400 border border-green-500/20'
                      }`}
                    >
                      {q.status}
                    </span>
                    <Link
                      to="/admin/quotes"
                      className="p-1 text-industrial-muted hover:text-industrial-orange border border-industrial-border/60 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-industrial-muted py-6">No quote requests registered yet.</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-panel p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-industrial-border/60 pb-3">
            <h3 className="font-display font-black text-lg text-industrial-light flex items-center gap-2">
              <Mail className="h-5 w-5 text-industrial-orange" /> Recent Contact Messages
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs font-bold uppercase tracking-wider text-industrial-orange hover:underline flex items-center gap-0.5"
            >
              All Messages <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-industrial-border/30">
            {recentMessages.length > 0 ? (
              recentMessages.map((m) => (
                <div key={m._id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="truncate text-left space-y-1">
                    <p className="font-semibold text-sm text-industrial-light truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-industrial-muted truncate italic">
                      "{m.message}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        m.status === 'Unread'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-industrial-steel/40 text-industrial-muted'
                      }`}
                    >
                      {m.status}
                    </span>
                    <Link
                      to="/admin/messages"
                      className="p-1 text-industrial-muted hover:text-industrial-orange border border-industrial-border/60 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-industrial-muted py-6">No contact messages received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
