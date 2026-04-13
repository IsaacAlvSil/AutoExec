<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function showLogin()
    {
        if (session('api_token')) {
            return redirect()->route('dashboard');
        }
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $response = $this->api->login($request->email, $request->password);

            // Log temporal para debug
        \Log::info('API Response Status: ' . $response->status());
        \Log::info('API Response Body: ' . $response->body());


        if ($response->successful()) {
            $data = $response->json();
            session([
                'api_token' => 'authenticated',  
                'user'      => $data['usuario'], 
            ]);
            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'email' => 'Credenciales incorrectas. Verifica tu email y contraseña.',
        ]);
    }

    public function logout(Request $request)
    {
        $request->session()->flush();
        return redirect()->route('login');
    }

    public function showRegistro()
    {
        return view('auth.registro');
    }

    public function registro(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $response = $this->api->registro($request->only('nombre', 'email', 'password'));

        if ($response->successful()) {
            return redirect()->route('login')->with('success', 'Cuenta creada. Inicia sesión.');
        }

        return back()->withErrors(['email' => 'Error al crear la cuenta. El email ya puede estar registrado.']);
    }

    public function showRecuperar()
    {
        return view('auth.recuperar');
    }

    public function recuperar(Request $request)
    {
        $request->validate([
            'email'          => 'required|email',
            'nueva_password' => 'required|min:6|confirmed',
        ]);

        $response = $this->api->cambiarPassword($request->email, $request->nueva_password);

        if ($response->successful()) {
            return redirect()->route('login')->with('success', 'Contraseña actualizada correctamente.');
        }

        return back()->withErrors(['email' => 'No se encontró una cuenta con ese email.']);
    }
}