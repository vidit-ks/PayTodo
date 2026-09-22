import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Check, AlertCircle } from 'lucide-react';

const CATEGORIES = ['General', 'Work', 'Study', 'Personal', 'Fitness', 'Shopping'];
const PRIORITIES = [
  { level: 'Low', label: 'Low' },
  { level: 'Medium', label: 'Medium' },
  { level: 'High', label: 'High' }
];
const CHECKBOX_STYLES = [
  { id: 'circle', label: 'Circle (Default)' },
  { id: 'square', label: 'Square' },
  { id: 'ballot', label: 'Ballot' },
  { id: 'check', label: 'Checkmark' }
];
const RECURRENCE_OPTIONS = ['None', 'Daily', 'Weekly', 'Monthly'];

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const { hasFeature, openUpgradeModal, subscription, updateGlobalCheckboxStyle } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [recurrence, setRecurrence] = useState('None');
  const [checkboxStyle, setCheckboxStyle] = useState('circle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'General');
      setPriority(taskToEdit.priority || 'Medium');
      setRecurrence(taskToEdit.recurrence || 'None');
      setCheckboxStyle(taskToEdit.checkbox_style || 'circle');
    } else {
      setTitle('');
      setDescription('');
      setCategory('General');
      setPriority('Medium');
      setRecurrence('None');
      setCheckboxStyle('circle');
    }
    setErrorMsg('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const canUseCustomCheckbox = hasFeature('custom_checkboxes');
  const canUsePriority = hasFeature('priority_labels');
  const canUseCategories = hasFeature('categories');
  const canUseRecurrence = hasFeature('recurring_tasks');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      if (canUseCustomCheckbox && checkboxStyle) {
        updateGlobalCheckboxStyle(checkboxStyle);
      }

      await onSave({
        title: title.trim(),
        description: description.trim(),
        category: canUseCategories ? category : 'General',
        priority: canUsePriority ? priority : 'Medium',
        recurrence: canUseRecurrence ? recurrence : 'None',
        checkbox_style: canUseCustomCheckbox ? checkboxStyle : 'circle'
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.75rem', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            background: '#f1f5f9',
            borderRadius: 'var(--radius-sm)',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>
          {taskToEdit ? 'Edit Task' : 'Create Task'}
        </h3>

        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Complete code review, draft report..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9rem',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Additional task details or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                background: '#ffffff',
                resize: 'none'
              }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Priority (Pro & Business) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Priority
                </label>
                {!canUsePriority && (
                  <span 
                    className="badge-locked"
                    onClick={() => openUpgradeModal('Priority Labels', 'Pro')}
                  >
                    Pro
                  </span>
                )}
              </div>
              <select
                value={priority}
                disabled={!canUsePriority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: canUsePriority ? '#ffffff' : '#f8fafc',
                  fontSize: '0.85rem',
                  cursor: canUsePriority ? 'pointer' : 'not-allowed'
                }}
              >
                {PRIORITIES.map(p => (
                  <option key={p.level} value={p.level}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Category (Pro & Business) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Category
                </label>
                {!canUseCategories && (
                  <span 
                    className="badge-locked"
                    onClick={() => openUpgradeModal('Task Categories', 'Pro')}
                  >
                    Pro
                  </span>
                )}
              </div>
              <select
                value={category}
                disabled={!canUseCategories}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: canUseCategories ? '#ffffff' : '#f8fafc',
                  fontSize: '0.85rem',
                  cursor: canUseCategories ? 'pointer' : 'not-allowed'
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Checkbox Style (Starter+) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Checkbox Style
                </label>
                {!canUseCustomCheckbox && (
                  <span 
                    className="badge-locked"
                    onClick={() => openUpgradeModal('Custom Checkboxes', 'Starter')}
                  >
                    Starter
                  </span>
                )}
              </div>
              <select
                value={checkboxStyle}
                disabled={!canUseCustomCheckbox}
                onChange={(e) => setCheckboxStyle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: canUseCustomCheckbox ? '#ffffff' : '#f8fafc',
                  fontSize: '0.85rem',
                  cursor: canUseCustomCheckbox ? 'pointer' : 'not-allowed'
                }}
              >
                {CHECKBOX_STYLES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Recurrence (Business Only) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Recurrence
                </label>
                {!canUseRecurrence && (
                  <span 
                    className="badge-locked"
                    onClick={() => openUpgradeModal('Recurring Tasks', 'Business')}
                  >
                    Business
                  </span>
                )}
              </div>
              <select
                value={recurrence}
                disabled={!canUseRecurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: canUseRecurrence ? '#ffffff' : '#f8fafc',
                  fontSize: '0.85rem',
                  cursor: canUseRecurrence ? 'pointer' : 'not-allowed'
                }}
              >
                {RECURRENCE_OPTIONS.map(r => (
                  <option key={r} value={r}>{r === 'None' ? 'None' : `Repeat ${r}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
