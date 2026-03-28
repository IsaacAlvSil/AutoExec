<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VacanteController;
use App\Http\Controllers\CandidatoController;
use App\Http\Controllers\PostulacionController;

/*
|--------------------------------------------------------------------------
| Web Routes - AutoExec (Login Simulado SIN middleware)
|--------------------------------------------------------------------------
*/

// HOME
Route::get('/', function () {
    return redirect('/login');
});

// ========================
// LOGIN
// ========================
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', function () {
    session(['user' => 'admin']);
    return redirect('/dashboard');
});

Route::get('/logout', function () {
    session()->forget('user');
    return redirect('/login');
});

// ========================
// DASHBOARD
// ========================
Route::get('/dashboard', function () {
    if (!session('user')) return redirect('/login');
    return view('dashboard');
})->name('dashboard');

// ========================
// VACANTES
// ========================
Route::get('/vacantes', function (VacanteController $c) {
    if (!session('user')) return redirect('/login');
    return $c->index();
})->name('vacantes');

Route::post('/vacantes', [VacanteController::class, 'store'])->name('vacantes.store');
Route::put('/vacantes/{index}', [VacanteController::class, 'update'])->name('vacantes.update');
Route::delete('/vacantes/{index}', [VacanteController::class, 'destroy'])->name('vacantes.delete');

// ========================
// CANDIDATOS
// ========================
Route::get('/candidatos', function (CandidatoController $c) {
    if (!session('user')) return redirect('/login');
    return $c->index();
})->name('candidatos');

Route::post('/candidatos', [CandidatoController::class, 'store'])->name('candidatos.store');
Route::put('/candidatos/{index}', [CandidatoController::class, 'update'])->name('candidatos.update');
Route::delete('/candidatos/{index}', [CandidatoController::class, 'destroy'])->name('candidatos.delete');

// ========================
// POSTULACIONES
// ========================
Route::get('/postulaciones', function (PostulacionController $c) {
    if (!session('user')) return redirect('/login');
    return $c->index();
})->name('postulaciones');

Route::post('/postulaciones', [PostulacionController::class, 'store'])->name('postulaciones.store');
Route::put('/postulaciones/{index}', [PostulacionController::class, 'update'])->name('postulaciones.update');
Route::delete('/postulaciones/{index}', [PostulacionController::class, 'destroy'])->name('postulaciones.delete');

// ========================
// OTROS
// ========================
Route::get('/evaluaciones', function () {
    if (!session('user')) return redirect('/login');
    return view('evaluaciones');
})->name('evaluaciones');

Route::get('/reportes', function () {
    if (!session('user')) return redirect('/login');
    return view('reportes');
})->name('reportes');

Route::get('/comunicacion', function () {
    if (!session('user')) return redirect('/login');
    return view('comunicacion');
})->name('comunicacion');

Route::get('/admin', function () {
    if (!session('user')) return redirect('/login');
    return view('admin');
})->name('admin');

// PERFIL
Route::get('/profile', function () {
    if (!session('user')) return redirect('/login');
    return view('profile.edit');
})->name('profile.edit');