<?php

use App\Http\Controllers\CalculationController;
use Illuminate\Support\Facades\Route;

Route::get('/calculations', [CalculationController::class, 'index']);
Route::post('/calculations', [CalculationController::class, 'store']);
Route::get('/calculations/{calculation}', [CalculationController::class, 'show']);
Route::delete('/calculations/{calculation}', [CalculationController::class, 'destroy']);
Route::get('/calculations', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Emballage Carton', 'value' => 150],
        ['id' => 2, 'name' => 'Emballage Plastique', 'value' => 200],
    ]);
});
