import { formatCoefficient, formatWeight } from '../utils/validation';

export default function PackagingInput({
  title,
  label,
  coefficient,
  value,
  onChange,
  total,
  totalLabel,
}) {
  return (
    <fieldset className="sap-group-box">
      <legend className="sap-group-box-title">{title}</legend>

      <div className="sap-form-row">
        <label htmlFor={`input-${title}`} className="sap-form-label">
          {label}
        </label>
        <div className="sap-form-input-wrap">
          <input
            id={`input-${title}`}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sap-input"
          />
        </div>
      </div>

      <div className="sap-form-row">
        <span className="sap-form-label">Coefficient</span>
        <div className="sap-form-input-wrap">
          <div className="sap-input-readonly">{formatCoefficient(coefficient)} kg</div>
        </div>
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
