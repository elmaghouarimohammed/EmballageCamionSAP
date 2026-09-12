import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PackagingInput from '../components/PackagingInput';
import TotalWeight from '../components/TotalWeight';
import WoodPallets from '../components/WoodPallets';
import { weights } from '../constants/weights';
import { saveCalculation } from '../services/api';
import { isValidDecimalInput, isValidIntegerInput, parseNonNegativeInteger, parseNonNegativeNumber } from '../utils/validation';

let palletIdCounter = 0;

function createWoodPallet(weight = '') {
  palletIdCounter += 1;
  return { id: palletIdCounter, weight };
}

export default function Home() {
  const [caisse, setCaisse] = useState('');
  const [cartoneFrais, setCartoneFrais] = useState('');
  const [cartoneCongle035, setCartoneCongle035] = useState('');
  const [cartoneCongle058, setCartoneCongle058] = useState('');
  const [palletePlastique72, setPalletePlastique72] = useState('');
  const [palletePlastique16, setPalletePlastique16] = useState('');
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

  const handleDecimalChange = useCallback((id, value) => {
    if (!isValidDecimalInput(value)) return;
    setPalettesBois((prev) =>
      prev.map((p) => (p.id === id ? { ...p, weight: value } : p))
    );
  }, []);

  const addWoodPallet = useCallback(() => {
    setPalettesBois((prev) => [...prev, createWoodPallet()]);
  }, []);

  const removeWoodPallet = useCallback((id) => {
    setPalettesBois((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const caisseQty = parseNonNegativeInteger(caisse) ?? 0;
  const cartoneFraisQty = parseNonNegativeInteger(cartoneFrais) ?? 0;
  const cartoneCongle035Qty = parseNonNegativeInteger(cartoneCongle035) ?? 0;
  const cartoneCongle058Qty = parseNonNegativeInteger(cartoneCongle058) ?? 0;
  const palletePlastique72Qty = parseNonNegativeInteger(palletePlastique72) ?? 0;
  const palletePlastique16Qty = parseNonNegativeInteger(palletePlastique16) ?? 0;

  const caisseTotal = caisseQty * weights.caisse;
  const cartoneFraisTotal = cartoneFraisQty * weights.cartoneFrais;
  const cartoneCongle035Total = cartoneCongle035Qty * weights.cartoneCongle035;
  const cartoneCongle058Total = cartoneCongle058Qty * weights.cartoneCongle058;
  const palletePlastique72Total = palletePlastique72Qty * weights.palletePlastique72;
  const palletePlastique16Total = palletePlastique16Qty * weights.palletePlastique16;

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
        pallete_plastique_16_quantity: palletePlastique16Qty,
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
            coefficient="1.5"
            value={caisse}
            onChange={handleIntegerChange(setCaisse)}
            total={caisseTotal}
            totalLabel="Total poids caisse"
          />

          <PackagingInput
            title="Cartone frais"
            label="Nombre de cartons frais"
            coefficient="0.32"
            value={cartoneFrais}
            onChange={handleIntegerChange(setCartoneFrais)}
            total={cartoneFraisTotal}
            totalLabel="Total poids cartone frais"
          />

          <PackagingInput
            title="Cartone congle (0.35)"
            label="Nombre de cartons"
            coefficient="0.35"
            value={cartoneCongle035}
            onChange={handleIntegerChange(setCartoneCongle035)}
            total={cartoneCongle035Total}
            totalLabel="Total poids cartone congle (0.35)"
          />

          <PackagingInput
            title="Cartone congle (0.58)"
            label="Nombre de cartons"
            coefficient="0.58"
            value={cartoneCongle058}
            onChange={handleIntegerChange(setCartoneCongle058)}
            total={cartoneCongle058Total}
            totalLabel="Total poids cartone congle (0.58)"
          />

          <PackagingInput
            title="Pallete plastique (7.2)"
            label="Nombre de palettes"
            coefficient="7.2"
            value={palletePlastique72}
            onChange={handleIntegerChange(setPalletePlastique72)}
            total={palletePlastique72Total}
            totalLabel="Total poids pallete plastique (7.2)"
          />

          <PackagingInput
            title="Pallete plastique (16)"
            label="Nombre de palettes"
            coefficient="16"
            value={palletePlastique16}
            onChange={handleIntegerChange(setPalletePlastique16)}
            total={palletePlastique16Total}
            totalLabel="Total poids pallete plastique (16)"
          />

          <WoodPallets
            pallets={palettesBois}
            onAdd={addWoodPallet}
            onRemove={removeWoodPallet}
            onChange={handleDecimalChange}
            total={palleteBoisTotal}
          />
        </div>

        <TotalWeight total={totalGeneral} onSave={handleSave} isSaving={isSaving} />
      </main>
    </>
  );
}
