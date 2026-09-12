<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'caisse_quantity',
    'caisse_total',
    'cartone_frais_quantity',
    'cartone_frais_total',
    'cartone_congle_035_quantity',
    'cartone_congle_035_total',
    'cartone_congle_058_quantity',
    'cartone_congle_058_total',
    'pallete_plastique_72_quantity',
    'pallete_plastique_72_total',
    'pallete_plastique_16_quantity',
    'pallete_plastique_16_total',
    'palettes_bois',
    'palettes_bois_total',
    'total_general',
])]
class Calculation extends Model
{
    protected function casts(): array
    {
        return [
            'caisse_total' => 'decimal:2',
            'cartone_frais_total' => 'decimal:2',
            'cartone_congle_035_total' => 'decimal:2',
            'cartone_congle_058_total' => 'decimal:2',
            'pallete_plastique_72_total' => 'decimal:2',
            'pallete_plastique_16_total' => 'decimal:2',
            'palettes_bois' => 'array',
            'palettes_bois_total' => 'decimal:2',
            'total_general' => 'decimal:2',
        ];
    }
}
