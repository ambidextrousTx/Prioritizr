import React, { useState } from 'react';
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
  const MAX_ENTRIES = 10;

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

  const closeModal = () => setShowLimitModal(false);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
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

  return (
    <div className="container">
      <h1 className="title">Drop-n-Drop Task Prioritizer</h1>
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
              className="item"
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              >
                {entry.text}
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
