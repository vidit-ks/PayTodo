import React, { useState } from 'react';
import { Check, Plus, Trash2, Sparkles, ArrowRight } from 'lucide-react';

export default function InteractiveDemo({ onOpenAuth }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Write your first task', completed: true },
    { id: 2, title: 'Complete something meaningful', completed: true },
    { id: 3, title: 'Plan tomorrow’s schedule', completed: false }
  ]);
  const [inputTitle, setInputTitle] = useState('');

  const handleToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: inputTitle.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInputTitle('');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <section id="demo" style={{
      padding: '5rem 1rem',
      maxWidth: '750px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Try it yourself.
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Interactive preview — test the speed, feel, and simplicity right now.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06)'
      }}>
        {/* Progress Bar Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
            Live Progress ({completedCount} of {tasks.length})
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0d9488' }}>
            {progressPercent}%
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0d9488, #10b981)',
            transition: 'width 0.25s ease'
          }}></div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Type a new task and press Add..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.88rem',
              background: '#f8fafc'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </form>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => handleToggle(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.9rem',
                borderRadius: '8px',
                background: t.completed ? '#f8fafc' : '#ffffff',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: t.completed ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                  background: t.completed ? '#10b981' : '#ffffff',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {t.completed && <Check size={12} strokeWidth={3} />}
                </div>

                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: t.completed ? '500' : '600',
                  color: t.completed ? '#94a3b8' : '#0f172a',
                  textDecoration: t.completed ? 'line-through' : 'none'
                }}>
                  {t.title}
                </span>
              </div>

              <button
                onClick={(e) => handleDelete(t.id, e)}
                title="Delete task"
                style={{ color: '#94a3b8', padding: '0.2rem', background: 'none', border: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Ready to organize your actual workspace?
          </span>

          <button
            onClick={onOpenAuth}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#0d9488',
              fontWeight: '700',
              fontSize: '0.85rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>Create Your Free Account</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
