import { formatWeight } from '../utils/validation';

export default function DynamicWeightInputs({
  title,
  inputPrefix,
  addButtonLabel,
  items,
  onAdd,
  onRemove,
  onChange,
  total,
  totalLabel,
}) {
  return (
    <fieldset className="sap-group-box">
      <legend className="sap-group-box-title">{title}</legend>

      {items.length === 0 && (
        <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#555' }}>
          Aucun poids saisi. Cliquez sur le bouton ci-dessous pour commencer.
        </p>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="sap-pallet-row">
          <div className="sap-form-row" style={{ flex: 1 }}>
            <label htmlFor={`weight-${item.id}`} className="sap-form-label">
              {inputPrefix} - {index + 1}
            </label>
            <div className="sap-form-input-wrap">
              <input
                id={`weight-${item.id}`}
                type="text"
                inputMode="decimal"
                value={item.weight}
                onChange={(e) => onChange(item.id, e.target.value)}
                className="sap-input"
              />
              <span className="sap-input-suffix">kg</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="sap-btn-link"
          >
            Supprimer
          </button>
        </div>
      ))}

      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <button type="button" onClick={onAdd} className="sap-btn">
          {addButtonLabel}
        </button>
      </div>

      <div className="sap-form-row">
        <span className="sap-form-label">{totalLabel}</span>
        <div className="sap-form-input-wrap">
          <div className="sap-input-readonly">{formatWeight(total)}</div>
        </div>
      </div>
    </fieldset>
  );
}
