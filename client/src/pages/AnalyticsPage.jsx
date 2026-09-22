import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Lock, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981'
};

export default function AnalyticsPage({ onNavigateToPlans }) {
  const { user, subscription, hasFeature } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const isBusiness = subscription?.plan === 'business' || hasFeature('task_analytics');

  useEffect(() => {
    async function loadAnalytics() {
      if (!isBusiness) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        if (res.success) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [user, isBusiness]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const blob = await api.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paytodo_tasks_${user?.name || 'export'}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Failed to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  if (!isBusiness) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem 4rem 1rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background: '#ffffff'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Lock size={24} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Analytics is Locked
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
            Task analytics, category charts, and CSV exporting are available on the <strong>Business Plan (₹20/month)</strong>.
          </p>

          <button
            className="btn-primary"
            onClick={onNavigateToPlans}
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <span>Upgrade to Business</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '0 1rem 4rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', marginBottom: '0.25rem' }}>
            Task Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Insights and completion metrics for your workspace.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={handleExportCsv}
          disabled={exporting}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.55rem 1rem' }}
        >
          <Download size={15} />
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <div>
          {/* KPI Cards Grid (Spec #31) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Tasks
                </span>
                <Layers size={16} color="var(--primary-500)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {data?.totalTasks || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Completed
                </span>
                <CheckCircle2 size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>
                {data?.completedTasks || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Active Tasks
                </span>
                <Clock size={16} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>
                {data?.activeTasks || 0}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Completion Rate
                </span>
                <TrendingUp size={16} color="var(--primary-600)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-600)' }}>
                {data?.completionRate || 0}%
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {/* Category Breakdown Bar Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                Tasks by Category
              </h3>
              <div style={{ height: '230px', width: '100%' }}>
                {data?.categories && data.categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No category data
                  </div>
                )}
              </div>
            </div>

            {/* Priority Distribution Pie Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                Priority Distribution
              </h3>
              <div style={{ height: '230px', width: '100%' }}>
                {data?.priorities && data.priorities.some(p => p.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.priorities.filter(p => p.count > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="name"
                      >
                        {data.priorities.filter(p => p.count > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#0d9488'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No priority distribution data
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
