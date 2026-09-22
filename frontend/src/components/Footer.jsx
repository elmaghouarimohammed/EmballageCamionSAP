export default function Footer({ message }) {
  return (
    <div className="sap-status-bar no-print">
      <span>{message || 'Prêt'}</span>
      <span>© 2026 — Mohammed Elmaghouari</span>
    </div>
  );
}
