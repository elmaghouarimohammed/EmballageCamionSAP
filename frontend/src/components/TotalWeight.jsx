import { useState } from 'react';
import { formatNumber, formatWeight } from '../utils/validation';

export default function TotalWeight({ total, onSave, isSaving }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = formatNumber(total);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <fieldset className="sap-group-box">
      <legend className="sap-group-box-title">Total général</legend>

      <div className="sap-form-row">
        <span className="sap-form-label">TOTAL GÉNÉRAL</span>
        <div className="sap-form-input-wrap">
          <div
            className="sap-input-readonly"
            style={{ fontWeight: 'bold', fontSize: '14px', background: '#fff9c4' }}
          >
            {formatWeight(total)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleCopy} className="sap-btn">
          Copier le total
        </button>

        {onSave && (
          <button type="button" onClick={onSave} disabled={isSaving} className="sap-btn">
            {isSaving ? 'Enregistrement...' : 'Enregistrer le calcul'}
          </button>
        )}

        {copied && (
          <span style={{ alignSelf: 'center', color: '#006600', fontWeight: 'bold' }}>
            ✓ Total copié !
          </span>
        )}
      </div>
    </fieldset>
  );
}
