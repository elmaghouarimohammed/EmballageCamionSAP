import { formatNumber, formatWeight, parseNonNegativeNumber } from '../utils/validation';

function toNumber(value) {
  return parseNonNegativeNumber(value) ?? 0;
}

function sumWeights(items = []) {
  return items.reduce((total, item) => total + toNumber(item.weight), 0);
}

export default function PrintDifferenceBlock({ poidsPese = [], poidsMoins = [], poidsProduitsEmballage = '' }) {
  const totalPese = sumWeights(poidsPese);
  const totalMoins = sumWeights(poidsMoins);
  const apresSoustraction = totalPese - totalMoins;
  const produitsValue = toNumber(poidsProduitsEmballage);
  const ecart = apresSoustraction - produitsValue;
  const rowCount = Math.max(poidsPese.length, poidsMoins.length, 1);

  return (
    <fieldset className="sap-group-box print-only">
      <legend className="sap-group-box-title">Différence de poids</legend>

      <div className="cond-table-wrap">
        <table className="cond-table ecart-table">
          <thead>
            <tr>
              <th>Poids pesé</th>
              <th>Poids moins</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, index) => (
              <tr key={index}>
                <td className="cond-qty">
                  {poidsPese[index] ? formatNumber(toNumber(poidsPese[index].weight)) : ''}
                </td>
                <td className="cond-qty">
                  {poidsMoins[index] ? formatNumber(toNumber(poidsMoins[index].weight)) : ''}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="cond-total-row">
              <td>
                <div className="ecart-total-label">TOTAL POIDS PESE</div>
                <div className="ecart-total-value">{formatNumber(totalPese)}</div>
              </td>
              <td>
                <div className="ecart-total-label">TOTAL POIDS MOINS</div>
                <div className="ecart-total-value">{formatNumber(totalMoins)}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="print-diff-footer">
        <p>
          <strong>POIDS APRÈS SOUSTRACTION :</strong> {formatWeight(apresSoustraction)}
        </p>
        <p>
          <strong>POIDS DE PRODUITS ET EMBALLAGE :</strong> {formatWeight(produitsValue)}
        </p>
        <p>
          <strong>ECART :</strong> {formatWeight(ecart)}
        </p>
      </div>
    </fieldset>
  );
}
