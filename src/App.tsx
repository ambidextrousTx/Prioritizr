import React, { useState, useEffect } from 'react';
import './App.css';

interface Entry {
  id: string;
  text: string;
}

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<string>('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const MAX_ENTRIES = 10;

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLimitModal(false);
      }
    };

    if (showLimitModal) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [showLimitModal])

  const addEntry = () => {
    if (entries.length >= MAX_ENTRIES) {
      setShowLimitModal(true);
      return;
    }
    if (newEntry.trim()) {
      setEntries([...entries, { id: Date.now().toString(), text: newEntry }]);
      setNewEntry('');
    }
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;
    setEntries(entries.map(e => e.id === editingId ? { ...e, text: editText } : e));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const closeModal = () => setShowLimitModal(false);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    if (editingId) return;
    setDraggedIdx(index);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (draggedIdx === null || draggedIdx === dropIndex) return;

    const newEntries = [...entries];
    const [draggedItem] = newEntries.splice(draggedIdx, 1);
    newEntries.splice(dropIndex, 0, draggedItem);

    setEntries(newEntries);
    setDraggedIdx(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedIdx(null);
    // Reset all backgrounds
    document.querySelectorAll('li').forEach(li => {
      li.classList.remove('drag-over');
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Drop-n-Drop Task Prioritizer</h1>
      <button className="btn" onClick={() => setTheme(t => t==='light'?'dark':'light')}>
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <div className="input-group">
        <input
          type="text"
          className="input"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          placeholder="What is on the agenda?"
        />
        <button className='btn' onClick={addEntry}>Add</button>
      </div>

      {entries.length === 0 ? (
        <p className="empty-state">No entries yet. Add tasks above</p>
      ) : (
        <ul className="list">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className={`item ${editingId === entry.id ? 'editing' : ''}`}
              draggable={!editingId}
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onDoubleClick={() => startEdit(entry.id, entry.text)}
              >
                {editingId === entry.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn btn-small btn-save" onClick={saveEdit}>Save</button>
                    <button className="btn btn-small btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                entry.text
              )}
              <button
              className="delete-btn"
              onClick={() => deleteEntry(entry.id)}
              title="Delete this entry"
            >
              <svg viewBox="0 0 24 24">
                <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/>
              </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Show limit modal */}
      {showLimitModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>If everything is a priority, nothing is a priority!</h3>
            <p>
              You've reached the limit of <strong>{MAX_ENTRIES}</strong> entries.
              <br />
              Time to prioritize or delete a few!
            </p>
            <button className="btn btn-close" onClick={closeModal}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
