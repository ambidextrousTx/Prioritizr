import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { addEntry, deleteEntry, updateEntry, reorderEntries, MAX_ENTRIES } from './entries';

xdescribe('App Integration', () => {
  it('adds an entry', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/What is on the agenda?/i);
    const button = screen.getByRole('button', { name: /add/i });

    userEvent.type(input, 'Buy milk');
    userEvent.click(button);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('shows modal at 11th entry', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/What is on the agenda?/i);
    const button = screen.getByRole('button', { name: /add/i });

    // Add 10 entries
    for (let i = 1; i <= 10; i++) {
      userEvent.clear(input);
      userEvent.type(input, `Item ${i}`);
      userEvent.click(button);
    }

    // Try 11th
    userEvent.clear(input);
    userEvent.type(input, 'Item 11');
    userEvent.click(button);

    expect(screen.getByText(/If everything is a priority, nothing is a priority!/i)).toBeInTheDocument();
  });

  it('deletes an entry', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/What is on the agenda?/i);
    const addBtn = screen.getByRole('button', { name: /add/i });

    userEvent.type(input, 'Delete me');
    userEvent.click(addBtn);

    const deleteBtn = screen.getByTitle(/Delete this entry/i);
    userEvent.click(deleteBtn);

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });
});

describe('entries utils (pure functions)', () => {
  const base = [{ id: '1', text: 'A' }, { id: '2', text: 'B' }];

  it('adds entry', () => {
    const { entries } = addEntry(base, 'C');
    expect(entries).toHaveLength(3);
    expect(entries[2].text).toBe('C');
  });

  it('blocks >10 entries', () => {
    const full = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, text: `Item ${i}` }));
    const { showLimit } = addEntry(full, 'Too many');
    expect(showLimit).toBe(true);
  });

  it('deletes entry', () => {
    const result = deleteEntry(base, '1');
    expect(result).toEqual([{ id: '2', text: 'B' }]);
  });

  it('updates entry', () => {
    const result = updateEntry(base, '1', 'Updated');
    expect(result[0].text).toBe('Updated');
  });

  it('reorders entries', () => {
    const result = reorderEntries(base, 0, 1);
    expect(result[0].text).toBe('B');
    expect(result[1].text).toBe('A');
  });
});
