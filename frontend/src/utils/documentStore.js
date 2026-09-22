const KEY = 'emb_documents';

export function loadDocuments() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function getDocument(id) {
  if (!id) return null;
  return loadDocuments()[id] || null;
}

export function listDocumentIds() {
  return Object.keys(loadDocuments()).sort().reverse();
}

export function listDocumentsWithMeta() {
  const all = loadDocuments();
  return Object.keys(all)
    .sort()
    .reverse()
    .map((id) => ({
      id,
      livreur: (all[id] && all[id].livreur) || '',
    }));
}

export function saveDocument(id, patch) {
  if (!id) return;
  const all = loadDocuments();
  all[id] = {
    ...(all[id] || { id }),
    ...patch,
    id,
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}
