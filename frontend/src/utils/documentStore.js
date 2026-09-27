import {
  isValidDocumentId,
  sanitizeId,
  sanitizePlainText,
  validateDocumentShape,
} from './security';

const KEY = 'emb_documents';
const MAX_DOCUMENTS = 500;

export function loadDocuments() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const safe = {};
    let count = 0;
    const keys = Object.keys(parsed).sort().reverse();
    for (const id of keys) {
      if (!isValidDocumentId(id)) continue;
      const validated = validateDocumentShape(parsed[id]);
      if (!validated) continue;
      safe[validated.id] = validated;
      count += 1;
      if (count >= MAX_DOCUMENTS) break;
    }
    return safe;
  } catch {
    return {};
  }
}

export function getDocument(id) {
  if (!isValidDocumentId(id)) return null;
  const clean = sanitizeId(id);
  return loadDocuments()[clean] || null;
}

export function listDocumentIds() {
  return Object.keys(loadDocuments())
    .filter(isValidDocumentId)
    .sort()
    .reverse();
}

export function listDocumentsWithMeta() {
  const all = loadDocuments();
  return Object.keys(all)
    .filter(isValidDocumentId)
    .sort()
    .reverse()
    .map((id) => ({
      id,
      livreur: sanitizePlainText((all[id] && all[id].livreur) || '', { maxLength: 120 }),
    }));
}

export function saveDocument(id, patch) {
  if (!isValidDocumentId(id)) return;
  const cleanId = sanitizeId(id);
  const all = loadDocuments();
  const base = all[cleanId] || { id: cleanId };
  const merged = { ...base, ...patch, id: cleanId };
  const validated = validateDocumentShape(merged);
  if (!validated) return;
  all[cleanId] = validated;
  localStorage.setItem(KEY, JSON.stringify(all));
}
