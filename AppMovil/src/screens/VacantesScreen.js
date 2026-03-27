import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

// 1. Recibimos "navigation" en los props
const VacantesScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVacantes();
    }, []);

    const fetchVacantes = async () => {
        try {
            // Recuerda usar la IP de tu compu (ej. 192.168.1.X) si usas celular físico
            const response = await fetch('http://192.168.1.72:5000/api/vacantes');
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
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vacantes Disponibles</Text>
            <FlatList
                data={vacantes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // 2. Cambiamos View por TouchableOpacity y agregamos el onPress
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DVacante', { vacante: item })}
                    >
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <Text style={styles.company}>{item.company}</Text>
                        {item.urgent && <Text style={styles.urgent}>¡Urgente!</Text>}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
    jobTitle: { fontSize: 18, fontWeight: 'bold' },
    company: { fontSize: 16, color: '#666', marginTop: 5 },
    urgent: { color: 'red', fontWeight: 'bold', marginTop: 5 }
});

export default VacantesScreen;