const HTML_TAG_REGEX = /<\/?[^>]+(>|$)/g;
const DANGEROUS_PROTO_REGEX = /(javascript|data|vbscript|about)\s*:/gi;
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const EXCESS_WS_REGEX = /\s{2,}/g;

export function sanitizePlainText(value, options = {}) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  s = s.replace(CONTROL_CHAR_REGEX, '');
  s = s.replace(HTML_TAG_REGEX, '');
  s = s.replace(DANGEROUS_PROTO_REGEX, '');
  if (options.trim !== false) s = s.trim();
  if (options.collapseWhitespace !== false) s = s.replace(EXCESS_WS_REGEX, ' ');
  const max = options.maxLength ?? 120;
  if (s.length > max) s = s.slice(0, max);
  return s;
}

export function sanitizeId(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[^A-Za-z0-9_\-:.\/]/g, '').slice(0, 80);
}

export function sanitizeDecimal(value) {
  if (value === '' || value === null || value === undefined) return '';
  let s = String(value).replace(CONTROL_CHAR_REGEX, '');
  s = s.replace(/[^0-9,]/g, '');
  const parts = s.split(',');
  if (parts.length > 2) s = `${parts[0]},${parts.slice(1).join('')}`;
  if (parts[1] && parts[1].length > 6) {
    s = `${parts[0]},${parts[1].slice(0, 6)}`;
  }
  return s;
}

export function sanitizeInteger(value) {
  if (value === '' || value === null || value === undefined) return '';
  return String(value).replace(/[^0-9]/g, '').slice(0, 12);
}

const SAFE_STRING = /^[\p{L}\p{N}\s@_.,'()+\-À-ÖØ-öø-ÿ]*$/u;
export function isSafeString(value, maxLen = 120) {
  if (value === null || value === undefined) return false;
  const s = String(value);
  return s.length <= maxLen && SAFE_STRING.test(s);
}

const VALID_ID_REGEX = /^EMB-\d{8}-\d{4,6}$/;
export function isValidDocumentId(id) {
  return typeof id === 'string' && VALID_ID_REGEX.test(id);
}

const VALID_DOC_DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

export function validateDocumentShape(doc) {
  if (!doc || typeof doc !== 'object') return null;
  if (!isValidDocumentId(doc.id)) return null;
  if (typeof doc.date !== 'string' || !VALID_DOC_DATE_REGEX.test(doc.date)) return null;

  const safe = {
    id: sanitizeId(doc.id),
    date: doc.date,
    livreur: sanitizePlainText(doc.livreur, { maxLength: 120 }),
    nombres: {},
    palettesBois: [],
    palettesPlastique16: [],
    poidsPese: [],
    poidsMoins: [],
    poidsProduitsEmballage: sanitizeDecimal(doc.poidsProduitsEmballage),
    savedAt: typeof doc.savedAt === 'string' ? doc.savedAt.slice(0, 64) : new Date().toISOString(),
  };

  if (doc.nombres && typeof doc.nombres === 'object') {
    for (const k of Object.keys(doc.nombres)) {
      safe.nombres[k] = sanitizeInteger(doc.nombres[k]);
    }
  }

  const sanitizePalletRows = (rows) =>
    Array.isArray(rows)
      ? rows
          .map((r) => ({
            nombre: sanitizeInteger(r && r.nombre),
            poidsUnitaire: sanitizeDecimal(r && r.poidsUnitaire),
          }))
          .slice(0, 100)
      : [];
  safe.palettesBois = sanitizePalletRows(doc.palettesBois);
  safe.palettesPlastique16 = sanitizePalletRows(doc.palettesPlastique16);

  const sanitizeWeightRows = (rows) =>
    Array.isArray(rows)
      ? rows.map((r) => ({ weight: sanitizeDecimal(r && r.weight) })).slice(0, 200)
      : [];
  safe.poidsPese = sanitizeWeightRows(doc.poidsPese);
  safe.poidsMoins = sanitizeWeightRows(doc.poidsMoins);

  return safe;
}
