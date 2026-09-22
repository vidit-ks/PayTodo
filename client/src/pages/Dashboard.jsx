import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import TaskModal from '../components/TaskModal';
import FloatingActionButton from '../components/FloatingActionButton';
import { 
  Plus, 
  Search, 
  Check, 
  Clock, 
  Trash2, 
  Edit3, 
  AlertTriangle,
  ArrowRight,
  CheckCheck,
  SquareCheck,
  Lock
} from 'lucide-react';

const CHECKBOX_OPTIONS = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'ballot', label: 'Ballot' },
  { id: 'check', label: 'Check' }
];

export default function Dashboard({ onNavigateToPlans }) {
  const { 
    user, 
    subscription, 
    hasFeature, 
    checkboxStyle, 
    updateGlobalCheckboxStyle,
    openUpgradeModal 
  } = useApp();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getTasks();
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleToggleComplete = async (task) => {
    try {
      const updatedList = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
      setTasks(updatedList);

      const res = await api.updateTask(task.id, { completed: !task.completed });
      if (res.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      fetchTasks();
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      const res = await api.updateTask(taskToEdit.id, taskData);
      if (res.success) {
        setTasks(tasks.map(t => t.id === taskToEdit.id ? res.task : t));
      }
    } else {
      const res = await api.createTask(taskData);
      if (res.success) {
        setTasks([res.task, ...tasks]);
      }
    }
  };

  const handleDeleteTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await api.deleteTask(id);
      if (res.success) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task, e) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const isFreePlan = subscription?.plan === 'free';
  const isLimitReached = isFreePlan && activeTasks.length >= 10;
  
  const canUseCustomCheckbox = hasFeature('custom_checkboxes');
  const canUsePriority = hasFeature('priority_labels');
  const canUseCategories = hasFeature('categories');
  const canUseRecurrence = hasFeature('recurring_tasks');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).filter(t => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query));
  });

  // Render checkbox based on user's active workspace checkboxStyle
  const renderCheckbox = (task) => {
    const isCompleted = task.completed;
    const activeStyle = canUseCustomCheckbox ? (checkboxStyle || 'circle') : 'circle';

    return (
      <div 
        className={`todo-checkbox ${isCompleted ? 'completed' : ''} ${activeStyle}`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleComplete(task);
        }}
        title={isCompleted ? 'Mark Active' : 'Mark Completed'}
      >
        {isCompleted && <Check size={13} strokeWidth={3} />}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem 6rem 1rem' }}>
      {/* Header Greeting */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
            Tasks — {user?.name || 'Workspace'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {activeTasks.length === 0 
              ? "All tasks completed." 
              : `${activeTasks.length} active task${activeTasks.length === 1 ? '' : 's'} remaining.`}
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={openCreateModal}
          disabled={isLimitReached}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Free Plan Limit Warning Banner */}
      {isLimitReached && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={18} color="#b45309" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#92400e' }}>
                You have reached the Free plan limit (10 active tasks).
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Upgrade to create additional tasks.
              </div>
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={onNavigateToPlans}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <span>View Plans</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Control Bar: Filters, Global Checkbox Style Selector, and Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {/* Left: Filter Pills */}
        <div style={{
          display: 'inline-flex',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '0.2rem'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: filter === 'all' ? '700' : '500',
              background: filter === 'all' ? '#0d9488' : 'transparent',
              color: filter === 'all' ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            All ({tasks.length})
          </button>

          <button
            onClick={() => setFilter('active')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: filter === 'active' ? '700' : '500',
              background: filter === 'active' ? '#0d9488' : 'transparent',
              color: filter === 'active' ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Active ({activeTasks.length})
          </button>

          <button
            onClick={() => setFilter('completed')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: filter === 'completed' ? '700' : '500',
              background: filter === 'completed' ? '#0d9488' : 'transparent',
              color: filter === 'completed' ? '#ffffff' : '#64748b',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Completed ({completedTasks.length})
          </button>
        </div>

        {/* Center/Right: Workspace Checkbox Style Selector */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '0.2rem 0.4rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginLeft: '0.2rem', marginRight: '0.2rem' }}>
            Style:
          </span>

          {CHECKBOX_OPTIONS.map((opt) => {
            const isSelected = (canUseCustomCheckbox ? checkboxStyle : 'circle') === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateGlobalCheckboxStyle(opt.id)}
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#0d9488' : '#64748b',
                  background: isSelected ? '#f0fdfa' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{opt.label}</span>
                {!canUseCustomCheckbox && opt.id !== 'circle' && (
                  <Lock size={10} color="#94a3b8" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '200px',
          width: '100%'
        }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.75rem 0.4rem 2rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.9rem' }}>
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1px solid #e2e8f0'
        }}>
          <CheckCheck size={28} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
            No tasks found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {searchQuery ? 'No tasks match your search filter.' : 'Create a new task to get started.'}
          </p>
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={15} />
            <span>Add Task</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.1rem',
                background: task.completed ? '#f8fafc' : '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                opacity: task.completed ? 0.75 : 1,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
              }}
            >
              {/* Checkbox and Content */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: '1', minWidth: 0 }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {renderCheckbox(task)}
                </div>

                <div style={{ minWidth: 0, flex: '1' }}>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: task.completed ? '500' : '600',
                    color: task.completed ? '#64748b' : '#0f172a',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    wordBreak: 'break-word',
                    lineHeight: '1.4'
                  }}>
                    {task.title}
                  </div>

                  {task.description && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      marginTop: '0.2rem',
                      lineHeight: '1.4'
                    }}>
                      {task.description}
                    </div>
                  )}

                  {/* Badges (Rendered strictly if user plan supports them) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                    {canUsePriority && task.priority && task.priority !== 'Medium' && (
                      <span className={`badge ${task.priority === 'High' ? 'badge-high' : 'badge-low'}`}>
                        {task.priority}
                      </span>
                    )}

                    {canUseCategories && task.category && task.category !== 'General' && (
                      <span className="badge badge-category">
                        {task.category}
                      </span>
                    )}

                    {canUseRecurrence && task.recurrence && task.recurrence !== 'None' && (
                      <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                        <Clock size={11} />
                        <span>{task.recurrence}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.75rem', flexShrink: 0 }}>
                <button
                  onClick={(e) => openEditModal(task, e)}
                  title="Edit"
                  style={{
                    padding: '0.4rem',
                    borderRadius: '4px',
                    color: '#64748b',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  title="Delete"
                  style={{
                    padding: '0.4rem',
                    borderRadius: '4px',
                    color: '#64748b',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onClick={openCreateModal} />

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
