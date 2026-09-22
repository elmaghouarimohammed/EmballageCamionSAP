export default function Navbar({
  documents = [],
  selectedDocId = '',
  onSave,
  onSelectId,
}) {
  return (
    <div className="sap-title-bar no-print">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span>EmballageCamionSAP</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {documents.length > 0 && (
            <select
              value={selectedDocId}
              onChange={(e) => onSelectId && onSelectId(e.target.value)}
              className="nav-select"
              style={{
                border: '2px inset #808080',
                background: '#fff',
                padding: '2px 4px',
                fontSize: '12px',
                fontFamily: 'Tahoma, Arial, sans-serif',
                height: '24px',
                borderRadius: '0',
                minWidth: '320px',
              }}
            >
              <option value="">Historique des documents</option>
              {documents.map(({ id, livreur }) => (
                <option key={id} value={id}>
                  {livreur ? `${id} : ${livreur}` : id}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={onSave}
            className="sap-btn"
            style={{
              border: '2px outset #c0c0c0',
              background: '#ece9d8',
              padding: '2px 14px',
              fontSize: '12px',
              fontFamily: 'Tahoma, Arial, sans-serif',
              cursor: 'pointer',
              height: '24px',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ece9d8')}
            onMouseDown={(e) => (e.currentTarget.style.borderStyle = 'inset')}
            onMouseUp={(e) => (e.currentTarget.style.borderStyle = 'outset')}
          >
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
