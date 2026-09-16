import { formatWeight } from '../utils/validation';

export default function WoodPallets({
  pallets,
  onAdd,
  onRemove,
  onChange,
  total,
  title = 'Pallete bois',
  itemLabel = 'Pallete bois',
  addButtonLabel = '+ Ajouter une pallete bois',
  emptyLabel = 'Aucune palette bois. Cliquez sur « Ajouter une pallete bois ».',
  totalLabel = 'Total poids pallete bois',
  fullWidth = true,
}) {
  return (
    <fieldset
      className="sap-group-box"
      style={fullWidth ? { gridColumn: '1 / -1' } : undefined}
    >
      <legend className="sap-group-box-title">{title}</legend>

      {pallets.length === 0 && (
        <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#555' }}>
          {emptyLabel}
        </p>
      )}

      {pallets.map((pallet, index) => (
        <div key={pallet.id} className="sap-pallet-row">
          <div className="sap-form-row" style={{ flex: 1 }}>
            <label htmlFor={`${title}-${pallet.id}`} className="sap-form-label">
              {itemLabel} {index + 1}
            </label>
            <div className="sap-form-input-wrap">
              <input
                id={`${title}-${pallet.id}`}
                type="text"
                inputMode="decimal"
                value={pallet.weight}
                onChange={(e) => onChange(pallet.id, e.target.value)}
                placeholder="0,00"
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
