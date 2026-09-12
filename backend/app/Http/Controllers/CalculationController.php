<?php

namespace App\Http\Controllers;

use App\Models\Calculation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalculationController extends Controller
{
    private const WEIGHTS = [
        'caisse' => 1.5,
        'cartone_frais' => 0.32,
        'cartone_congle_035' => 0.35,
        'cartone_congle_058' => 0.58,
        'pallete_plastique_72' => 7.2,
        'pallete_plastique_16' => 16,
    ];

    public function index(): JsonResponse
    {
        $calculations = Calculation::query()
            ->orderByDesc('created_at')
            ->get();

        return response()->json($calculations);
    }

    public function show(Calculation $calculation): JsonResponse
    {
        return response()->json($calculation);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'caisse_quantity' => ['required', 'integer', 'min:0'],
            'cartone_frais_quantity' => ['required', 'integer', 'min:0'],
            'cartone_congle_035_quantity' => ['required', 'integer', 'min:0'],
            'cartone_congle_058_quantity' => ['required', 'integer', 'min:0'],
            'pallete_plastique_72_quantity' => ['required', 'integer', 'min:0'],
            'pallete_plastique_16_quantity' => ['required', 'integer', 'min:0'],
            'palettes_bois' => ['nullable', 'array'],
            'palettes_bois.*' => ['numeric', 'min:0'],
            'total_general' => ['required', 'numeric', 'min:0'],
        ]);

        $caisseTotal = $validated['caisse_quantity'] * self::WEIGHTS['caisse'];
        $cartoneFraisTotal = $validated['cartone_frais_quantity'] * self::WEIGHTS['cartone_frais'];
        $cartoneCongle035Total = $validated['cartone_congle_035_quantity'] * self::WEIGHTS['cartone_congle_035'];
        $cartoneCongle058Total = $validated['cartone_congle_058_quantity'] * self::WEIGHTS['cartone_congle_058'];
        $palletePlastique72Total = $validated['pallete_plastique_72_quantity'] * self::WEIGHTS['pallete_plastique_72'];
        $palletePlastique16Total = $validated['pallete_plastique_16_quantity'] * self::WEIGHTS['pallete_plastique_16'];

        $palettesBois = $validated['palettes_bois'] ?? [];
        $palettesBoisTotal = array_reduce(
            $palettesBois,
            fn (float $carry, $weight) => $carry + (float) $weight,
            0.0
        );

        $calculation = Calculation::create([
            'caisse_quantity' => $validated['caisse_quantity'],
            'caisse_total' => round($caisseTotal, 2),
            'cartone_frais_quantity' => $validated['cartone_frais_quantity'],
            'cartone_frais_total' => round($cartoneFraisTotal, 2),
            'cartone_congle_035_quantity' => $validated['cartone_congle_035_quantity'],
            'cartone_congle_035_total' => round($cartoneCongle035Total, 2),
            'cartone_congle_058_quantity' => $validated['cartone_congle_058_quantity'],
            'cartone_congle_058_total' => round($cartoneCongle058Total, 2),
            'pallete_plastique_72_quantity' => $validated['pallete_plastique_72_quantity'],
            'pallete_plastique_72_total' => round($palletePlastique72Total, 2),
            'pallete_plastique_16_quantity' => $validated['pallete_plastique_16_quantity'],
            'pallete_plastique_16_total' => round($palletePlastique16Total, 2),
            'palettes_bois' => $palettesBois,
            'palettes_bois_total' => round($palettesBoisTotal, 2),
            'total_general' => round($validated['total_general'], 2),
        ]);

        return response()->json($calculation, 201);
    }

    public function destroy(Calculation $calculation): JsonResponse
    {
        $calculation->delete();

        return response()->json(['message' => 'Calculation deleted successfully']);
    }
}
