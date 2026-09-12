import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DifferenceResult from '../components/DifferenceResult';
import DynamicWeightInputs from '../components/DynamicWeightInputs';
import { formatWeight, isValidDecimalInput, parseNonNegativeNumber } from '../utils/validation';

let weightIdCounter = 0;

function createWeightItem(weight = '') {
  weightIdCounter += 1;
  return { id: weightIdCounter, weight };
}

function sumWeights(items) {
  return items.reduce(
    (total, item) => total + (parseNonNegativeNumber(item.weight) ?? 0),
    0
  );
}

export default function Difference() {
  const [poids1, setPoids1] = useState([]);
  const [poidsMoins, setPoidsMoins] = useState([]);
  const [poidsProduitsEmballage, setPoidsProduitsEmballage] = useState('');
  const { setFooterMessage } = useOutletContext();

  useEffect(() => {
    setFooterMessage('Prêt');
  }, [setFooterMessage]);

  const handleChange = useCallback((setter) => (id, value) => {
    if (!isValidDecimalInput(value)) return;
    setter((prev) =>
      prev.map((item) => (item.id === id ? { ...item, weight: value } : item))
    );
  }, []);

  const addPoids1 = useCallback(() => {
    setPoids1((prev) => [...prev, createWeightItem()]);
  }, []);

  const removePoids1 = useCallback((id) => {
    setPoids1((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addPoidsMoins = useCallback(() => {
    setPoidsMoins((prev) => [...prev, createWeightItem()]);
  }, []);

  const removePoidsMoins = useCallback((id) => {
    setPoidsMoins((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleProduitsChange = useCallback((value) => {
    if (isValidDecimalInput(value)) {
      setPoidsProduitsEmballage(value);
    }
  }, []);

  const totalPoids1 = useMemo(() => sumWeights(poids1), [poids1]);
  const totalPoidsMoins = useMemo(() => sumWeights(poidsMoins), [poidsMoins]);
  const poidsApresSoustraction = totalPoids1 - totalPoidsMoins;
  const poidsProduitsValue = parseNonNegativeNumber(poidsProduitsEmballage) ?? 0;
  const difference = poidsApresSoustraction - poidsProduitsValue;

  return (
    <main className="sap-content flex-1">
      <div className="sap-form-grid">
        <DynamicWeightInputs
          title="Poids pese"
          inputPrefix="Poids pese"
          addButtonLabel="+ Ajouter un poids pese"
          items={poids1}
          onAdd={addPoids1}
          onRemove={removePoids1}
          onChange={handleChange(setPoids1)}
          total={totalPoids1}
          totalLabel="TOTAL POIDS PESE"
        />

        <DynamicWeightInputs
          title="Poids moins"
          inputPrefix="Poids moins"
          addButtonLabel="+ Ajouter un poids moins"
          items={poidsMoins}
          onAdd={addPoidsMoins}
          onRemove={removePoidsMoins}
          onChange={handleChange(setPoidsMoins)}
          total={totalPoidsMoins}
          totalLabel="TOTAL POIDS MOINS"
        />

        <fieldset className="sap-group-box">
          <legend className="sap-group-box-title">Résultat après soustraction</legend>
          <div className="sap-form-row">
            <span className="sap-form-label">POIDS APRÈS SOUSTRACTION</span>
            <div className="sap-form-input-wrap">
              <div
                className="sap-input-readonly"
                style={{ fontWeight: 'bold', background: '#fff9c4' }}
              >
                {formatWeight(poidsApresSoustraction)}
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="sap-group-box">
          <legend className="sap-group-box-title">Poids de produits et emballage</legend>
          <div className="sap-form-row">
            <label htmlFor="poids-produits" className="sap-form-label">
              Poids de produits et emballage
            </label>
            <div className="sap-form-input-wrap">
              <input
                id="poids-produits"
                type="text"
                inputMode="decimal"
                value={poidsProduitsEmballage}
                onChange={(e) => handleProduitsChange(e.target.value)}
                className="sap-input"
              />
              <span className="sap-input-suffix">kg</span>
            </div>
          </div>
          <div className="sap-form-row">
            <span className="sap-form-label">POIDS DE PRODUITS ET EMBALLAGE</span>
            <div className="sap-form-input-wrap">
              <div className="sap-input-readonly">{formatWeight(poidsProduitsValue)}</div>
            </div>
          </div>
        </fieldset>
      </div>

      <DifferenceResult difference={difference} />
    </main>
  );
}
