<?php

use App\Http\Controllers\CalculationController;
use Illuminate\Support\Facades\Route;

Route::get('/calculations', [CalculationController::class, 'index']);
Route::post('/calculations', [CalculationController::class, 'store']);
Route::get('/calculations/{calculation}', [CalculationController::class, 'show']);
Route::delete('/calculations/{calculation}', [CalculationController::class, 'destroy']);
Route::get('/calculations', function () {
    return \App\Models\Calculation::all();
});
