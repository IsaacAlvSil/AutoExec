<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>AutoExec</title>

    @php
        $manifestPath = public_path('build/manifest.json');
    @endphp

    @if (file_exists($manifestPath))
        @php
            $manifest = json_decode(file_get_contents($manifestPath), true);
        @endphp

        <link rel="stylesheet" href="/build/{{ $manifest['resources/css/app.css']['file'] }}">
        <script src="/build/{{ $manifest['resources/js/app.js']['file'] }}" defer></script>
    @else
        <!-- fallback si no existe build -->
        <p style="color:red;">⚠️ Vite no compilado (ejecuta npm run build)</p>
    @endif

</head>

<body class="bg-gray-100 font-sans">
    <div class="flex min-h-screen">

        <!-- SIDEBAR -->
        @include('layouts.navigation')

        <!-- CONTENIDO -->
        <main class="flex-1 p-6">
            @yield('content')
        </main>

    </div>
</body>
</html>