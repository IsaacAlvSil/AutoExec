<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CandidatoController extends Controller
{
    public function index()
    {
        $candidatos = session('candidatos', []);
        return view('candidatos', compact('candidatos'));
    }

    public function store(Request $request)
    {
        $candidatos = session('candidatos', []);

        $candidatos[] = $request->all();

        session(['candidatos' => $candidatos]);

        return redirect()->route('candidatos');
    }

    public function update(Request $request, $index)
    {
        $candidatos = session('candidatos', []);

        $candidatos[$index] = $request->all();

        session(['candidatos' => $candidatos]);

        return redirect()->route('candidatos');
    }

    public function destroy($index)
    {
        $candidatos = session('candidatos', []);

        unset($candidatos[$index]);

        session(['candidatos' => array_values($candidatos)]);

        return redirect()->route('candidatos');
    }
}