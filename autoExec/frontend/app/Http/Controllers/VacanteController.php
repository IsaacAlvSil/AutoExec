<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VacanteController extends Controller
{
    public function index()
    {
        $vacantes = session('vacantes', []);
        return view('vacantes', compact('vacantes'));
    }

    public function store(Request $request)
    {
        $vacantes = session('vacantes', []);

        $vacantes[] = $request->all();

        session(['vacantes' => $vacantes]);

        return redirect()->route('vacantes');
    }

    public function update(Request $request, $index)
    {
        $vacantes = session('vacantes', []);

        $vacantes[$index] = $request->all();

        session(['vacantes' => $vacantes]);

        return redirect()->route('vacantes');
    }

    public function destroy($index)
    {
        $vacantes = session('vacantes', []);

        unset($vacantes[$index]);

        session(['vacantes' => array_values($vacantes)]);

        return redirect()->route('vacantes');
    }
}