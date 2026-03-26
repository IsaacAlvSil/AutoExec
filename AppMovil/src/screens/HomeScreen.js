import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
    // 1. Creamos los estados para guardar las vacantes y el estado de carga
    const [vacantes, setVacantes] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 2. Usamos useEffect para llamar a la API justo cuando la pantalla se abre
    useEffect(() => {
        obtenerVacantes();
    }, []);

    const obtenerVacantes = async () => {
        try {
            const respuesta = await fetch('http://192.168.1.72:5000/api/vacantes');
            const datos = await respuesta.json();

            setVacantes(datos); // Guardamos los datos de la API en el estado
            setCargando(false); // Apagamos el símbolo de carga
        } catch (error) {
            console.error("Error conectando con la API:", error);
            setCargando(false);
        }
    };

    // 3. Mostramos un "Cargando..." mientras llegan los datos
    if (cargando) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    // 4. Mostramos la lista real que viene desde tu backend
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>Vacantes Disponibles</Text>

            <FlatList
                data={vacantes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                        <Text style={{ fontSize: 16, color: 'gray' }}>{item.company}</Text>
                    </View>
                )}
            />
        </View>
    );
}