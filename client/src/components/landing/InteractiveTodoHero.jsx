import React, { useState } from 'react';
import { Check, CheckCircle2, Clock, Flame, Plus, ShieldCheck } from 'lucide-react';

export default function InteractiveTodoHero() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project demo', completed: true, priority: 'High', category: 'Work' },
    { id: 2, title: 'Study DSA & system concepts', completed: false, priority: 'High', category: 'Study' },
    { id: 3, title: 'Finish sprint assignment', completed: false, priority: 'Medium', category: 'Work' },
    { id: 4, title: 'Evening 5km run', completed: false, priority: 'Low', category: 'Fitness' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      {/* Main Todo Dashboard Mockup */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: '16px',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Mock Window Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#cbd5e1' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#cbd5e1' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#cbd5e1' }}></div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginLeft: '0.5rem' }}>
              PayTodo
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
            Today
          </div>
        </div>

        {/* Mock Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Hello, User
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>
              Today's Tasks
            </p>
          </div>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: task.completed ? '#f8fafc' : '#ffffff',
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
                    border: task.completed ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                    background: task.completed ? '#10b981' : '#ffffff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}>
                    {task.completed && <Check size={12} strokeWidth={3} />}
                  </div>

                  <span style={{
                    fontSize: '0.88rem',
                    fontWeight: task.completed ? '500' : '600',
                    color: task.completed ? '#94a3b8' : '#0f172a',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '600',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                    color: '#475569'
                  }}>
                    {task.category}
                  </span>
                  {task.priority !== 'Low' && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '600',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: task.priority === 'High' ? '#fef2f2' : '#fffbeb',
                      color: task.priority === 'High' ? '#b91c1c' : '#b45309'
                    }}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Info Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.78rem',
            color: '#64748b'
          }}>
            <span>{tasks.length} tasks · {completedCount} completed</span>
            <span style={{ color: '#0d9488', fontWeight: '600' }}>Click any task to toggle</span>
          </div>
        </div>
      </div>

      {/* Floating Micro-Card 1: Today's Progress (Desktop) */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-30px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.12)',
        zIndex: 3,
        width: '190px'
      }} className="hero-floating-card-1">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Daily Progress
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
            {progressPercent}%
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #0d9488, #10b981)', transition: 'width 0.3s ease' }}></div>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
          {completedCount} of {tasks.length} tasks completed
        </div>
      </div>

      {/* Floating Micro-Card 2: Focus Mode (Desktop) */}
      <div style={{
        position: 'absolute',
        bottom: '-25px',
        left: '-30px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.12)',
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }} className="hero-floating-card-2">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#f0fdfa',
          color: '#0d9488',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={16} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a' }}>
            Focus Session
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
            25:00 Remaining
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-floating-card-1, .hero-floating-card-2 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
