import { formatWeight } from '../utils/validation';

export default function WoodPallets({ pallets, onAdd, onRemove, onChange, total }) {
  return (
    <fieldset className="sap-group-box" style={{ gridColumn: '1 / -1' }}>
      <legend className="sap-group-box-title">Pallete bois</legend>

      {pallets.length === 0 && (
        <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#555' }}>
          Aucune palette bois. Cliquez sur « Ajouter une pallete bois ».
        </p>
      )}

      {pallets.map((pallet, index) => (
        <div key={pallet.id} className="sap-pallet-row">
          <div className="sap-form-row" style={{ flex: 1 }}>
            <label htmlFor={`wood-${pallet.id}`} className="sap-form-label">
              Pallete bois {index + 1}
            </label>
            <div className="sap-form-input-wrap">
              <input
                id={`wood-${pallet.id}`}
                type="text"
                inputMode="decimal"
                value={pallet.weight}
                onChange={(e) => onChange(pallet.id, e.target.value)}
                className="sap-input"
              />
              <span className="sap-input-suffix">kg</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(pallet.id)}
            className="sap-btn-link"
          >
            Supprimer
          </button>
        </div>
      ))}

      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <button type="button" onClick={onAdd} className="sap-btn">
          + Ajouter une pallete bois
        </button>
      </div>

      <div className="sap-form-row">
        <span className="sap-form-label">Total poids pallete bois</span>
        <div className="sap-form-input-wrap">
          <div className="sap-input-readonly">{formatWeight(total)}</div>
        </div>
      </div>
    </fieldset>
  );
}
