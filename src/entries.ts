export interface Entry {
  id: string;
  text: string;
}

export const MAX_ENTRIES = 10;

export const addEntry = ( entries: Entry[], text: string): { entries: Entry[], showLimit?: boolean} => {
  if (!text.trim()) return { entries };
  if (entries.length >= MAX_ENTRIES) return {
    entries, showLimit: true
  };
  return {
    entries: [...entries, { id: Date.now().toString(), text}],
    showLimit: false
  };
};

export const deleteEntry = (entries: Entry[], id: string): Entry[] => {
  return entries.filter(e => e.id !== id);
};

export const updateEntry = (entries: Entry[], id: string, text: string): Entry[] => {
  if (!text.trim()) return entries;
  return entries.map(e => e.id === id ? { ...e, text } : e);
};

export const reorderEntries = ( entries: Entry[], sourceIndex: number, destIndex: number): Entry[] => {
  const result = Array.from(entries);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destIndex, 0, removed);
  return result;
};
