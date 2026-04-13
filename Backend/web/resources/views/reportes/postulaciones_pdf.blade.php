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
        .total { font-weight: bold; color: #1a1a2e; }
    </style>
</head>
<body>
    <h1>Reporte de Postulaciones</h1>
    <p class="fecha">Generado el {{ now()->format('d/m/Y H:i') }} · Total vacantes con postulaciones: {{ count($postulaciones) }}</p>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Vacante</th>
                <th>Total postulaciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($postulaciones as $i => $post)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $post['vacante'] }}</td>
                <td class="total">{{ $post['total'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 20px; font-size: 11px; color: #666;">
        Total de postulaciones: {{ array_sum(array_column($postulaciones, 'total')) }}
    </p>
</body>
</html>