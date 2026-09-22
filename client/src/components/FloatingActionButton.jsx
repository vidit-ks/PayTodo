import React from 'react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick }) {
  return (
    <div className="fab-container">
      <button 
        className="fab-button"
        onClick={onClick}
        title="Add New Task (Quick Action)"
        aria-label="Add Task"
      >
        <div className="fab-pulse"></div>
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}
