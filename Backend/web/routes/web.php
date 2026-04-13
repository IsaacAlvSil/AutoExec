<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VacanteController;
use App\Http\Controllers\PerfilController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PostulacionController;
use App\Http\Controllers\ReporteController;




// Autenticación
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/registro', [AuthController::class, 'showRegistro'])->name('registro');
Route::post('/registro', [AuthController::class, 'registro']);
Route::get('/recuperar-password', [AuthController::class, 'showRecuperar'])->name('recuperar');
Route::post('/recuperar-password', [AuthController::class, 'recuperar']);
Route::get('/vacantes/{id}/editar', [VacanteController::class, 'edit'])->name('vacantes.edit');
Route::put('/vacantes/{id}', [VacanteController::class, 'update'])->name('vacantes.update');
Route::delete('/vacantes/{id}', [VacanteController::class, 'destroy'])->name('vacantes.destroy');
Route::get('/notificaciones', [NotificacionController::class, 'index'])->name('notificaciones.index');
Route::put('/notificaciones/{id}/leida', [NotificacionController::class, 'marcarLeida'])->name('notificaciones.leida');
Route::put('/notificaciones/leidas/todas', [NotificacionController::class, 'marcarTodasLeidas'])->name('notificaciones.todasLeidas');
Route::delete('/notificaciones/{id}', [NotificacionController::class, 'eliminar'])->name('notificaciones.eliminar');
Route::delete('/notificaciones/leidas/eliminar', [NotificacionController::class, 'eliminarLeidas'])->name('notificaciones.eliminarLeidas');
Route::get('/vacantes/{id}/candidatos', [VacanteController::class, 'candidatos'])->name('vacantes.candidatos');
Route::post('/postulaciones/{id}/respuesta', [PostulacionController::class, 'responder'])->name('postulaciones.responder');
Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
Route::get('/reportes/candidatos/pdf', [ReporteController::class, 'pdfCandidatos'])->name('reportes.candidatos.pdf');
Route::get('/reportes/postulaciones/pdf', [ReporteController::class, 'pdfPostulaciones'])->name('reportes.postulaciones.pdf');



// Rutas protegidas
Route::middleware('api.auth')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Vacantes
    Route::get('/vacantes', [VacanteController::class, 'index'])->name('vacantes.index');
    Route::get('/vacantes/crear', [VacanteController::class, 'create'])->name('vacantes.create');
    Route::post('/vacantes', [VacanteController::class, 'store'])->name('vacantes.store');

    // Perfiles / Candidatos
    Route::get('/perfiles', [PerfilController::class, 'index'])->name('perfiles.index');
    Route::get('/perfiles/buscar', [PerfilController::class, 'buscar'])->name('perfiles.buscar');
    Route::get('/perfiles/{id}/editar', [PerfilController::class, 'edit'])->name('perfiles.edit');
    Route::put('/perfiles/{id}', [PerfilController::class, 'update'])->name('perfiles.update');
});