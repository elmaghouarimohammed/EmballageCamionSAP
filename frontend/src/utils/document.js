const SEQ_DATE_KEY = 'emb_doc_seq_date';
const SEQ_NUM_KEY = 'emb_doc_seq_num';

function formatDateParts(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return { y, m, d, key: `${y}${m}${d}` };
}

export function nextDocumentId(date = new Date()) {
  const { y, m, d, key } = formatDateParts(date);
  const lastDate = localStorage.getItem(SEQ_DATE_KEY);
  let storedNum;
  if (lastDate === key) {
    storedNum = Number(localStorage.getItem(SEQ_NUM_KEY) || 0) + 1;
  } else {
    storedNum = 1;
  }
  return `EMB-${y}${m}${d}-${String(storedNum).padStart(4, '0')}`;
}

export function commitDocumentId(date = new Date()) {
  const { key } = formatDateParts(date);
  const lastDate = localStorage.getItem(SEQ_DATE_KEY);
  let storedNum;
  if (lastDate === key) {
    storedNum = Number(localStorage.getItem(SEQ_NUM_KEY) || 0) + 1;
  } else {
    storedNum = 1;
  }
  localStorage.setItem(SEQ_DATE_KEY, key);
  localStorage.setItem(SEQ_NUM_KEY, String(storedNum));
  return storedNum;
}

export function generateDocumentId() {
  return nextDocumentId();
}

export function formatDocumentDate(date = new Date()) {
  const { d, m, y } = formatDateParts(date);
  return `${d}/${m}/${y}`;
}
