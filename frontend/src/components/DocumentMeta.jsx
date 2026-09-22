export default function DocumentMeta({
  documentId,
  documentDate,
  livreur,
  onLivreurChange,
  onPrint,
  mode = 'create',
  documentIds = [],
  onSelectId,
}) {
  const isSelect = mode === 'select';

  return (
    <fieldset className="sap-group-box">
      <legend className="sap-group-box-title">Document</legend>
      <h1 className="print-only-title">EmballageCamionSAP — Conditionnement</h1>

      <div className={`doc-meta-row ${isSelect ? 'doc-meta-row-select' : ''}`}>
        <div className="sap-form-row">
          <label htmlFor="doc-id" className="sap-form-label">ID</label>
          <div className="sap-form-input-wrap">
            {isSelect ? (
              <select
                id="doc-id"
                value={documentId}
                onChange={(e) => onSelectId(e.target.value)}
                className="sap-input"
              >
                <option value="">Sélectionner un ID</option>
                {documentIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="doc-id"
                type="text"
                value={documentId}
                readOnly
                className="sap-input sap-input-readonly"
              />
            )}
          </div>
        </div>

        <div className="sap-form-row">
          <label htmlFor="doc-date" className="sap-form-label">Date</label>
          <div className="sap-form-input-wrap">
            <input
              id="doc-date"
              type="text"
              value={documentDate}
              readOnly
              className="sap-input sap-input-readonly"
            />
          </div>
        </div>

        <div className="sap-form-row">
          <label htmlFor="doc-livreur" className="sap-form-label">Livreur</label>
          <div className="sap-form-input-wrap">
            <input
              id="doc-livreur"
              type="text"
              value={livreur}
              readOnly={isSelect}
              onChange={isSelect ? undefined : (e) => onLivreurChange(e.target.value)}
              className={`sap-input ${isSelect ? 'sap-input-readonly' : ''}`}
              placeholder={isSelect ? '' : 'Nom du livreur'}
            />
          </div>
        </div>

        {onPrint && (
          <button type="button" className="sap-btn no-print" onClick={onPrint}>
            Imprimer document
          </button>
        )}
      </div>
    </fieldset>
  );
}
