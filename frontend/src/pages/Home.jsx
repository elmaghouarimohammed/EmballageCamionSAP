import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PackagingInput from '../components/PackagingInput';
import TotalWeight from '../components/TotalWeight';
import WoodPallets from '../components/WoodPallets';
import { weights } from '../constants/weights';
import { saveCalculation } from '../services/api';
import { isValidDecimalInput, isValidIntegerInput, parseNonNegativeInteger, parseNonNegativeNumber } from '../utils/validation';

let itemIdCounter = 0;

function createItem() {
  itemIdCounter += 1;
  return { id: itemIdCounter, name: '', weight: '' };
}

export default function Home() {
  const [caisse, setCaisse] = useState('');
  const [cartoneFrais, setCartoneFrais] = useState('');
  const [cartoneCongle035, setCartoneCongle035] = useState('');
  const [cartoneCongle058, setCartoneCongle058] = useState('');
  const [palletePlastique72, setPalletePlastique72] = useState('');
  const [palettesPlastique16, setPalettesPlastique16] = useState([]);
  const [palettesBois, setPalettesBois] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Prêt');
  const { setFooterMessage } = useOutletContext();

  useEffect(() => {
    setFooterMessage(statusMessage);
  }, [statusMessage, setFooterMessage]);

  const handleIntegerChange = useCallback((setter) => (value) => {
    if (isValidIntegerInput(value)) {
      setter(value);
    }
  }, []);

  const handleWoodWeightChange = useCallback((id, value) => {
    if (!isValidDecimalInput(value)) return;
    setPalettesBois((prev) =>
      prev.map((p) => (p.id === id ? { ...p, weight: value } : p))
    );
  }, []);

  const addWoodPallet = useCallback(() => {
    setPalettesBois((prev) => [...prev, createItem()]);
  }, []);

  const removeWoodPallet = useCallback((id) => {
    setPalettesBois((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPlasticPallet = useCallback(() => {
    setPalettesPlastique16((prev) => [...prev, createItem()]);
  }, []);

  const removePlasticPallet = useCallback((id) => {
    setPalettesPlastique16((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handlePlasticWeightChange = useCallback((id, value) => {
    if (!isValidDecimalInput(value)) return;
    setPalettesPlastique16((prev) =>
      prev.map((p) => (p.id === id ? { ...p, weight: value } : p))
    );
  }, []);

  const caisseQty = parseNonNegativeInteger(caisse) ?? 0;
  const cartoneFraisQty = parseNonNegativeInteger(cartoneFrais) ?? 0;
  const cartoneCongle035Qty = parseNonNegativeInteger(cartoneCongle035) ?? 0;
  const cartoneCongle058Qty = parseNonNegativeInteger(cartoneCongle058) ?? 0;

  const palletePlastique72Qty = parseNonNegativeInteger(palletePlastique72) ?? 0;

  const caisseTotal = caisseQty * weights.caisse;
  const cartoneFraisTotal = cartoneFraisQty * weights.cartoneFrais;
  const cartoneCongle035Total = cartoneCongle035Qty * weights.cartoneCongle035;
  const cartoneCongle058Total = cartoneCongle058Qty * weights.cartoneCongle058;
  const palletePlastique72Total = palletePlastique72Qty * weights.palletePlastique72;

  const palletePlastique16Total = useMemo(
    () =>
      palettesPlastique16.reduce(
        (total, p) => total + (parseNonNegativeNumber(p.weight) ?? 0),
        0
      ),
    [palettesPlastique16]
  );

  const palleteBoisTotal = useMemo(
    () =>
      palettesBois.reduce(
        (total, p) => total + (parseNonNegativeNumber(p.weight) ?? 0),
        0
      ),
    [palettesBois]
  );

  const totalGeneral =
    caisseTotal +
    cartoneFraisTotal +
    cartoneCongle035Total +
    cartoneCongle058Total +
    palletePlastique72Total +
    palletePlastique16Total +
    palleteBoisTotal;

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('Enregistrement en cours...');
    try {
      await saveCalculation({
        caisse_quantity: caisseQty,
        cartone_frais_quantity: cartoneFraisQty,
        cartone_congle_035_quantity: cartoneCongle035Qty,
        cartone_congle_058_quantity: cartoneCongle058Qty,
        pallete_plastique_72_quantity: palletePlastique72Qty,
        pallete_plastique_16_quantity: palettesPlastique16.length,
        palettes_bois: palettesBois.map((p) => parseNonNegativeNumber(p.weight) ?? 0),
        total_general: totalGeneral,
      });
      setStatusMessage('✓ Calcul enregistré avec succès');
      setTimeout(() => setStatusMessage('Prêt'), 3000);
    } catch {
      setStatusMessage('Erreur lors de l\'enregistrement');
      setTimeout(() => setStatusMessage('Prêt'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <main className="sap-content flex-1">
        <div className="sap-form-grid sap-form-grid-3">
          <PackagingInput
            title="Caisse"
            label="Nombre de caisses"
            coefficient={weights.caisse}
            value={caisse}
            onChange={handleIntegerChange(setCaisse)}
            total={caisseTotal}
            totalLabel="Total poids caisse"
          />

          <PackagingInput
            title="Cartone frais"
            label="Nombre de cartons frais"
            coefficient={weights.cartoneFrais}
            value={cartoneFrais}
            onChange={handleIntegerChange(setCartoneFrais)}
            total={cartoneFraisTotal}
            totalLabel="Total poids cartone frais"
          />

          <PackagingInput
            title="Cartone congle (0,35)"
            label="Nombre de cartons"
            coefficient={weights.cartoneCongle035}
            value={cartoneCongle035}
            onChange={handleIntegerChange(setCartoneCongle035)}
            total={cartoneCongle035Total}
            totalLabel="Total poids cartone congle (0,35)"
          />

          <PackagingInput
            title="Cartone congle (0,58)"
            label="Nombre de cartons"
            coefficient={weights.cartoneCongle058}
            value={cartoneCongle058}
            onChange={handleIntegerChange(setCartoneCongle058)}
            total={cartoneCongle058Total}
            totalLabel="Total poids cartone congle (0,58)"
          />

          <PackagingInput
            title="Pallete plastique (7,2)"
            label="Nombre de palettes"
            coefficient={weights.palletePlastique72}
            value={palletePlastique72}
            onChange={handleIntegerChange(setPalletePlastique72)}
            total={palletePlastique72Total}
            totalLabel="Total poids pallete plastique (7,2)"
          />

          <WoodPallets
            title="Pallete plastique (16)"
            itemLabel="Pallete plastique (16)"
            addButtonLabel="+ Ajouter une pallete plastique (16)"
            emptyLabel="Aucune pallete plastique (16). Cliquez pour en ajouter une."
            totalLabel="Total poids pallete plastique (16)"
            pallets={palettesPlastique16}
            onAdd={addPlasticPallet}
            onRemove={removePlasticPallet}
            onChange={handlePlasticWeightChange}
            total={palletePlastique16Total}
            fullWidth={false}
          />

          <WoodPallets
            pallets={palettesBois}
            onAdd={addWoodPallet}
            onRemove={removeWoodPallet}
            onChange={handleWoodWeightChange}
            total={palleteBoisTotal}
          />
        </div>

        <TotalWeight total={totalGeneral} onSave={handleSave} isSaving={isSaving} />
      </main>
    </>
  );
}
