<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacante extends Model
{
    protected $fillable = [
        'titulo',
        'departamento',
        'ubicacion',
        'tipo_contrato',
        'salario_min',
        'salario_max',
        'prioridad',
        'estado',
        'descripcion'
    ];
}