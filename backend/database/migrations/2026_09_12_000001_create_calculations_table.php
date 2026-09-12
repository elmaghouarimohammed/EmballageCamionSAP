<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calculations', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('caisse_quantity')->default(0);
            $table->decimal('caisse_total', 10, 2)->default(0);
            $table->unsignedInteger('cartone_frais_quantity')->default(0);
            $table->decimal('cartone_frais_total', 10, 2)->default(0);
            $table->unsignedInteger('cartone_congle_035_quantity')->default(0);
            $table->decimal('cartone_congle_035_total', 10, 2)->default(0);
            $table->unsignedInteger('cartone_congle_058_quantity')->default(0);
            $table->decimal('cartone_congle_058_total', 10, 2)->default(0);
            $table->unsignedInteger('pallete_plastique_72_quantity')->default(0);
            $table->decimal('pallete_plastique_72_total', 10, 2)->default(0);
            $table->unsignedInteger('pallete_plastique_16_quantity')->default(0);
            $table->decimal('pallete_plastique_16_total', 10, 2)->default(0);
            $table->json('palettes_bois')->nullable();
            $table->decimal('palettes_bois_total', 10, 2)->default(0);
            $table->decimal('total_general', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calculations');
    }
};
