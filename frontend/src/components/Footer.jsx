export default function Footer({ message }) {
  return (
    <div className="sap-status-bar">
      <span>{message || 'Prêt'}</span>
      <span>© 2026 — Mohammed Elmaghouari</span>
    </div>
  );
}
