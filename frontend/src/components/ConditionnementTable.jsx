import { useState } from 'react';
import { formatCoefficient, formatNumber, normalizeDecimalInput } from '../utils/validation';

function TableInput({ id, value, onChange, placeholder = '', readOnly = false, decimal = false }) {
  const handleChange = onChange
    ? (e) => {
        let raw = e.target.value;
        if (decimal) raw = normalizeDecimalInput(raw);
        onChange(raw);
      }
    : undefined;

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={value}
      readOnly={readOnly}
      onChange={handleChange}
      placeholder={placeholder}
      className={readOnly ? 'cond-input cond-input-readonly' : 'cond-input'}
    />
  );
}

export default function ConditionnementTable({
  fixedRows,
  onFixedNombreChange,
  palettesBois,
  palettesPlastique16,
  onAddBois,
  onAddPlastique16,
  onPalletChange,
  onRemovePallet,
  totalQuantite,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = formatNumber(totalQuantite);
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <fieldset className="sap-group-box">
      <legend className="sap-group-box-title">Conditionnement</legend>

      <div className="cond-table-wrap">
        <table className="cond-table">
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Nombre</th>
              <th>Poids unitaire</th>
              <th>Quantité</th>
            </tr>
          </thead>
          <tbody>
            {fixedRows.map((row) => (
              <tr key={row.key}>
                <td>{row.label}</td>
                <td>
                  <TableInput
                    id={`nombre-${row.key}`}
                    value={row.nombre}
                    onChange={(value) => onFixedNombreChange(row.key, value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <TableInput
                    value={formatCoefficient(row.poidsUnitaire)}
                    readOnly
                  />
                </td>
                <td className="cond-qty">{formatNumber(row.quantite)}</td>
              </tr>
            ))}

            <tr className="cond-section-row">
              <td colSpan={4}>
                <div className="cond-section-head">
                  <span>Palette bois</span>
                  <button type="button" className="sap-btn no-print" onClick={onAddBois}>
                    Ajouter
                  </button>
                </div>
              </td>
            </tr>

            {palettesBois.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <div className="cond-label-actions">
                    <span>Palette bois {index + 1}</span>
                    <button
                      type="button"
                      className="sap-btn-link no-print"
                      onClick={() => onRemovePallet('bois', row.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
                <td>
                  <TableInput
                    value={row.nombre}
                    onChange={(value) => onPalletChange('bois', row.id, 'nombre', value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <TableInput
                    decimal
                    value={row.poidsUnitaire}
                    onChange={(value) => onPalletChange('bois', row.id, 'poidsUnitaire', value)}
                    placeholder="0,00"
                  />
                </td>
                <td className="cond-qty">{formatNumber(row.quantite)}</td>
              </tr>
            ))}

            <tr className="cond-section-row">
              <td colSpan={4}>
                <div className="cond-section-head">
                  <span>Palette plastique (16)</span>
                  <button type="button" className="sap-btn no-print" onClick={onAddPlastique16}>
                    Ajouter
                  </button>
                </div>
              </td>
            </tr>

            {palettesPlastique16.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <div className="cond-label-actions">
                    <span>Palette plastique (16) {index + 1}</span>
                    <button
                      type="button"
                      className="sap-btn-link no-print"
                      onClick={() => onRemovePallet('plastique16', row.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
                <td>
                  <TableInput
                    value={row.nombre}
                    onChange={(value) => onPalletChange('plastique16', row.id, 'nombre', value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <TableInput
                    decimal
                    value={row.poidsUnitaire}
                    onChange={(value) => onPalletChange('plastique16', row.id, 'poidsUnitaire', value)}
                    placeholder="0,00"
                  />
                </td>
                <td className="cond-qty">{formatNumber(row.quantite)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="cond-total-row">
              <td colSpan={3}>
                <div className="cond-total-cell">
                  <span>TOTAL GÉNÉRAL</span>
                  <button type="button" className="sap-btn no-print" onClick={handleCopy}>
                    Copier le total
                  </button>
                  {copied && <span className="cond-copied">✓ Total copié !</span>}
                </div>
              </td>
              <td className="cond-qty">{formatNumber(totalQuantite)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </fieldset>
  );
}
