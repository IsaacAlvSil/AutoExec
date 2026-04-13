<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
        h1 { color: #1a1a2e; font-size: 20px; margin-bottom: 4px; }
        .fecha { color: #666; font-size: 11px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #1a1a2e; color: white; padding: 8px; text-align: left; font-size: 11px; }
        td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        tr:nth-child(even) td { background: #f9fafb; }
        .badge { background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
    </style>
</head>
<body>
    <h1>Reporte de Candidatos</h1>
    <p class="fecha">Generado el {{ now()->format('d/m/Y H:i') }} · Total: {{ count($perfiles) }} candidatos</p>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Puesto actual</th>
                <th>Experiencia</th>
                <th>Ubicación</th>
                <th>Certificaciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($perfiles as $i => $perfil)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $perfil['nombre'] ?? '—' }} {{ $perfil['apellido'] ?? '' }}</td>
                <td>{{ $perfil['email'] ?? '—' }}</td>
                <td>{{ $perfil['puesto_actual'] ?? '—' }}</td>
                <td>{{ $perfil['experiencia_anios'] ?? 0 }} años</td>
                <td>{{ $perfil['ubicacion'] ?? '—' }}</td>
                <td>
                    @if(!empty($perfil['certificaciones']))
                        {{ implode(', ', array_column($perfil['certificaciones'], 'nombre')) }}
                    @else
                        —
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>