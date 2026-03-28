<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostulacionController extends Controller
{
    public function index()
    {
        $postulaciones = session('postulaciones', []);
        $candidatos = session('candidatos', []);
        $vacantes = session('vacantes', []);

        return view('postulaciones', compact('postulaciones','candidatos','vacantes'));
    }

    public function store(Request $request)
    {
        $postulaciones = session('postulaciones', []);

        $postulaciones[] = $request->all();

        session(['postulaciones' => $postulaciones]);

        return redirect()->route('postulaciones');
    }

    public function update(Request $request, $index)
    {
        $postulaciones = session('postulaciones', []);

        $postulaciones[$index]['estado'] = $request->estado;

        session(['postulaciones' => $postulaciones]);

        return redirect()->route('postulaciones');
    }

    public function destroy($index)
    {
        $postulaciones = session('postulaciones', []);

        unset($postulaciones[$index]);

        session(['postulaciones' => array_values($postulaciones)]);

        return redirect()->route('postulaciones');
    }
}