import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ConditionnementTable from '../components/ConditionnementTable';
import DifferenceResult from '../components/DifferenceResult';
import DocumentMeta from '../components/DocumentMeta';
import DynamicWeightInputs from '../components/DynamicWeightInputs';
import PrintDifferenceBlock from '../components/PrintDifferenceBlock';
import { weights } from '../constants/weights';
import {
  commitDocumentId,
  formatDocumentDate,
  nextDocumentId,
} from '../utils/document';
import {
  getDocument,
  listDocumentIds,
  saveDocument,
} from '../utils/documentStore';
import {
  formatWeight,
  isValidDecimalInput,
  isValidIntegerInput,
  normalizeDecimalInput,
  parseNonNegativeInteger,
  parseNonNegativeNumber,
} from '../utils/validation';

const FIXED_ITEMS = [
  { key: 'caisse', label: 'Caisse', poidsUnitaire: weights.caisse },
  { key: 'cartoneFrais', label: 'Carton frais', poidsUnitaire: weights.cartoneFrais },
  { key: 'cartoneCongle035', label: 'Carton congelé (0,35)', poidsUnitaire: weights.cartoneCongle035 },
  { key: 'cartoneCongle058', label: 'Carton congelé (0,58)', poidsUnitaire: weights.cartoneCongle058 },
  { key: 'palletePlastique72', label: 'Palette plastique (7,2)', poidsUnitaire: weights.palletePlastique72 },
];

const EMPTY_NOMBRES = {
  caisse: '',
  cartoneFrais: '',
  cartoneCongle035: '',
  cartoneCongle058: '',
  palletePlastique72: '',
};

let palletIdCounter = 0;
let weightIdCounter = 0;

function createPalletRow(nombre = '1', poidsUnitaire = '') {
  palletIdCounter += 1;
  return { id: palletIdCounter, nombre, poidsUnitaire };
}

function createWeightItem(weight = '') {
  weightIdCounter += 1;
  return { id: weightIdCounter, weight };
}

function rowQuantite(nombre, poidsUnitaire) {
  return (parseNonNegativeInteger(nombre) ?? 0) * (parseNonNegativeNumber(poidsUnitaire) ?? 0);
}

function sumWeights(items) {
  return items.reduce(
    (total, item) => total + (parseNonNegativeNumber(item.weight) ?? 0),
    0
  );
}

export default function Home() {
  const [nombres, setNombres] = useState(EMPTY_NOMBRES);
  const [palettesBois, setPalettesBois] = useState([]);
  const [palettesPlastique16, setPalettesPlastique16] = useState([]);
  const [creationDate, setCreationDate] = useState(() => new Date());
  const [documentId, setDocumentId] = useState(() => {
    const now = new Date();
    return nextDocumentId(now);
  });
  const [documentDate, setDocumentDate] = useState(() => formatDocumentDate());
  const [livreur, setLivreur] = useState('');
  const [poidsPese, setPoidsPese] = useState([]);
  const [poidsMoins, setPoidsMoins] = useState([]);
  const [poidsProduitsEmballage, setPoidsProduitsEmballage] = useState('');
  const {
    setFooterMessage,
    registerSaveHandler,
    registerSelectIdHandler,
    refreshDocumentIds,
    setSelectedDocId,
  } = useOutletContext();

  useEffect(() => {
    setFooterMessage('Prêt');
  }, [setFooterMessage]);

  const resetFormForNewDocument = useCallback(() => {
    palletIdCounter = 0;
    weightIdCounter = 0;
    setNombres({ ...EMPTY_NOMBRES });
    setPalettesBois([]);
    setPalettesPlastique16([]);
    setPoidsPese([]);
    setPoidsMoins([]);
    setPoidsProduitsEmballage('');
    setLivreur('');
    const now = new Date();
    setCreationDate(now);
    setDocumentId(nextDocumentId(now));
    setDocumentDate(formatDocumentDate(now));
    setSelectedDocId('');
  }, [setSelectedDocId]);

  const handleSave = useCallback(() => {
    const docData = {
      id: documentId,
      date: documentDate,
      livreur,
      nombres: { ...nombres },
      palettesBois: palettesBois.map(({ nombre, poidsUnitaire }) => ({ nombre, poidsUnitaire })),
      palettesPlastique16: palettesPlastique16.map(({ nombre, poidsUnitaire }) => ({ nombre, poidsUnitaire })),
      poidsPese: poidsPese.map(({ weight }) => ({ weight })),
      poidsMoins: poidsMoins.map(({ weight }) => ({ weight })),
      poidsProduitsEmballage,
      savedAt: new Date().toISOString(),
    };

    try {
      const existingIds = listDocumentIds();
      const isNewDoc = !existingIds.includes(documentId);
      saveDocument(documentId, docData);
      if (isNewDoc) {
        commitDocumentId(creationDate);
      }
      setFooterMessage(`Document ${documentId} enregistré avec succès.`);
      resetFormForNewDocument();
      if (refreshDocumentIds) refreshDocumentIds();
    } catch (err) {
      setFooterMessage(`Erreur lors de l'enregistrement: ${err.message}`);
    }
  }, [
    documentId,
    documentDate,
    livreur,
    nombres,
    palettesBois,
    palettesPlastique16,
    poidsPese,
    poidsMoins,
    poidsProduitsEmballage,
    creationDate,
    setFooterMessage,
    resetFormForNewDocument,
    refreshDocumentIds,
  ]);

  const handleSelectDocumentId = useCallback((id) => {
    const doc = getDocument(id);
    if (!doc) {
      setFooterMessage(`Document ${id} introuvable.`);
      return;
    }

    palletIdCounter = 0;
    weightIdCounter = 0;

    setNombres(doc.nombres ? { ...EMPTY_NOMBRES, ...doc.nombres } : { ...EMPTY_NOMBRES });
    setLivreur(doc.livreur || '');
    setDocumentId(doc.id || id);
    setDocumentDate(doc.date || formatDocumentDate());

    setPalettesBois(
      Array.isArray(doc.palettesBois)
        ? doc.palettesBois.map((r) => createPalletRow(r.nombre ?? '1', r.poidsUnitaire ?? ''))
        : []
    );
    setPalettesPlastique16(
      Array.isArray(doc.palettesPlastique16)
        ? doc.palettesPlastique16.map((r) => createPalletRow(r.nombre ?? '1', r.poidsUnitaire ?? ''))
        : []
    );
    setPoidsPese(
      Array.isArray(doc.poidsPese)
        ? doc.poidsPese.map((w) => createWeightItem(w.weight ?? ''))
        : []
    );
    setPoidsMoins(
      Array.isArray(doc.poidsMoins)
        ? doc.poidsMoins.map((w) => createWeightItem(w.weight ?? ''))
        : []
    );
    setPoidsProduitsEmballage(doc.poidsProduitsEmballage ?? '');

    setFooterMessage(`Document ${id} chargé.`);
  }, [setFooterMessage]);

  const saveRef = useRef(handleSave);
  const selectRef = useRef(handleSelectDocumentId);
  saveRef.current = handleSave;
  selectRef.current = handleSelectDocumentId;

  const stableSaveWrapper = useCallback(() => {
    saveRef.current();
  }, []);

  const stableSelectWrapper = useCallback((id) => {
    selectRef.current(id);
  }, []);

  useEffect(() => {
    if (registerSaveHandler) registerSaveHandler(() => stableSaveWrapper);
    if (registerSelectIdHandler) registerSelectIdHandler(() => stableSelectWrapper);
  }, [registerSaveHandler, registerSelectIdHandler, stableSaveWrapper, stableSelectWrapper]);

  const handleFixedNombreChange = useCallback((key, value) => {
    if (!isValidIntegerInput(value)) return;
    setNombres((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addBois = useCallback(() => {
    setPalettesBois((prev) => [...prev, createPalletRow()]);
  }, []);

  const addPlastique16 = useCallback(() => {
    setPalettesPlastique16((prev) => [...prev, createPalletRow()]);
  }, []);

  const handlePalletChange = useCallback((type, id, field, value) => {
    if (field === 'nombre' && !isValidIntegerInput(value)) return;
    if (field === 'poidsUnitaire') {
      value = normalizeDecimalInput(value);
      if (!isValidDecimalInput(value)) return;
    }

    const setter = type === 'bois' ? setPalettesBois : setPalettesPlastique16;
    setter((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }, []);

  const removePallet = useCallback((type, id) => {
    const setter = type === 'bois' ? setPalettesBois : setPalettesPlastique16;
    setter((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleWeightChange = useCallback((setter) => (id, value) => {
    value = normalizeDecimalInput(value);
    if (!isValidDecimalInput(value)) return;
    setter((prev) =>
      prev.map((item) => (item.id === id ? { ...item, weight: value } : item))
    );
  }, []);

  const addPoidsPese = useCallback(() => {
    setPoidsPese((prev) => [...prev, createWeightItem()]);
  }, []);

  const removePoidsPese = useCallback((id) => {
    setPoidsPese((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addPoidsMoins = useCallback(() => {
    setPoidsMoins((prev) => [...prev, createWeightItem()]);
  }, []);

  const removePoidsMoins = useCallback((id) => {
    setPoidsMoins((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleProduitsChange = useCallback((value) => {
    value = normalizeDecimalInput(value);
    if (isValidDecimalInput(value)) {
      setPoidsProduitsEmballage(value);
    }
  }, []);

  const fixedRows = useMemo(
    () =>
      FIXED_ITEMS.map((item) => {
        const nombre = nombres[item.key];
        const quantite = rowQuantite(nombre, item.poidsUnitaire);
        return { ...item, nombre, quantite };
      }),
    [nombres]
  );

  const palettesBoisRows = useMemo(
    () =>
      palettesBois.map((row) => ({
        ...row,
        quantite: rowQuantite(row.nombre, row.poidsUnitaire),
      })),
    [palettesBois]
  );

  const palettesPlastique16Rows = useMemo(
    () =>
      palettesPlastique16.map((row) => ({
        ...row,
        quantite: rowQuantite(row.nombre, row.poidsUnitaire),
      })),
    [palettesPlastique16]
  );

  const totalQuantite =
    fixedRows.reduce((sum, row) => sum + row.quantite, 0) +
    palettesBoisRows.reduce((sum, row) => sum + row.quantite, 0) +
    palettesPlastique16Rows.reduce((sum, row) => sum + row.quantite, 0);

  const totalPoidsPese = useMemo(() => sumWeights(poidsPese), [poidsPese]);
  const totalPoidsMoins = useMemo(() => sumWeights(poidsMoins), [poidsMoins]);
  const poidsApresSoustraction = totalPoidsPese - totalPoidsMoins;
  const poidsProduitsValue = parseNonNegativeNumber(poidsProduitsEmballage) ?? 0;
  const ecart = poidsApresSoustraction - poidsProduitsValue;

  return (
    <main className="sap-content flex-1" id="print-document">
      <DocumentMeta
        documentId={documentId}
        documentDate={documentDate}
        livreur={livreur}
        onLivreurChange={setLivreur}
        onPrint={() => window.print()}
      />

      <ConditionnementTable
        fixedRows={fixedRows}
        onFixedNombreChange={handleFixedNombreChange}
        palettesBois={palettesBoisRows}
        palettesPlastique16={palettesPlastique16Rows}
        onAddBois={addBois}
        onAddPlastique16={addPlastique16}
        onPalletChange={handlePalletChange}
        onRemovePallet={removePallet}
        totalQuantite={totalQuantite}
      />

      <div className="sap-form-grid no-print">
        <DynamicWeightInputs
          title="Poids pese"
          inputPrefix="Poids pese"
          addButtonLabel="+ Ajouter un poids pese"
          items={poidsPese}
          onAdd={addPoidsPese}
          onRemove={removePoidsPese}
          onChange={handleWeightChange(setPoidsPese)}
          total={totalPoidsPese}
          totalLabel="TOTAL POIDS PESE"
        />

        <DynamicWeightInputs
          title="Poids moins"
          inputPrefix="Poids moins"
          addButtonLabel="+ Ajouter un poids moins"
          items={poidsMoins}
          onAdd={addPoidsMoins}
          onRemove={removePoidsMoins}
          onChange={handleWeightChange(setPoidsMoins)}
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
                placeholder="0,00"
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

      <div className="no-print">
        <DifferenceResult difference={ecart} />
      </div>

      <PrintDifferenceBlock
        poidsPese={poidsPese}
        poidsMoins={poidsMoins}
        poidsProduitsEmballage={poidsProduitsEmballage}
      />
    </main>
  );
}
