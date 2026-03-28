import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de tener expo-linear-gradient instalado

// 1. Recibimos "navigation" en los props
const VacantesScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVacantes();
    }, []);

    const fetchVacantes = async () => {
        try {
            // 👇 Asegúrate de que esta IP sea la correcta hoy
            const response = await fetch('http:/10.16.35.92:5000/api/vacantes');
            const data = await response.json();
            setVacantes(data);
        } catch (error) {
            console.error("Error al cargar vacantes:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                {/* Ruedita de carga en azul brillante para contrastar con el fondo oscuro */}
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        // 👇 AGREGADO: LinearGradient para el fondo azul oscuro idéntico al HomeScreen
        <LinearGradient
            colors={['#0F172A', '#1E293B', '#334155']}
            style={styles.container}
        >
            {/* Título de la pantalla en blanco */}
            <Text style={styles.title}>Todas las Vacantes</Text>

            <FlatList
                data={vacantes}
                // 👇 CORRECCIÓN: Usamos id_vacante de tu base de datos
                keyExtractor={(item) => (item.id_vacante ? item.id_vacante.toString() : Math.random().toString())}
                renderItem={({ item }) => (
                    // 2. Cambiamos View por TouchableOpacity y agregamos el onPress
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DVacante', { vacante: item })}
                    >
                        {/* 👇 CORRECCIÓN: Usamos 'titulo' en lugar de 'title' */}
                        <Text style={styles.jobTitle}>{item.titulo}</Text>

                        {/* 👇 CORRECCIÓN: Salario ofrecido en lugar de empresa */}
                        <Text style={styles.company}>Sueldo: ${item.salario_ofrecido}</Text>

                        {/* 👇 CORRECCIÓN: Usamos 'estado' para decidir si mostramos 'Urgente' */}
                        {item.estado === 'Activa' && <Text style={styles.urgent}>Activa!</Text>}
                    </TouchableOpacity>
                )}
                // Espacio extra al final para que no lo tape el menú inferior (si tienes uno)
                ListFooterComponent={<View style={{ height: 30 }} />}
            />
        </LinearGradient>
    );
};

// 👇 ESTILOS ACTUALIZADOS PARA EL MODO OSCURO (BLUE PREMIUM)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 10, // Ajuste para barra de estado
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A' // Fondo oscuro mientras carga
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF', // Título en blanco para contrastar
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white', // Mantenemos las tarjetas blancas (se ve muy elegante sobre el azul oscuro)
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' }, // Texto oscuro dentro de tarjeta blanca
    company: { fontSize: 16, color: '#64748B', marginTop: 5 }, // Un gris elegante para el sueldo
    urgent: { color: '#038c25', fontWeight: 'bold', marginTop: 5 } // Rojo vibrante para urgente
});

export default VacantesScreen;