import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../config';

//pruebasWeb

const VacantesScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVacantes();
    }, []);

    const fetchVacantes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/vacantes`);
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
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0F172A', '#1E293B', '#334155']}
            style={styles.container}
        >
            <Text style={styles.title}>Todas las Vacantes</Text>

            <FlatList
                data={vacantes}
                keyExtractor={(item) => (item.id_vacante ? item.id_vacante.toString() : Math.random().toString())}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DVacante', { vacante: item })}
                    >
                        <Text style={styles.jobTitle}>{item.titulo}</Text>

                        <Text style={styles.company}>Sueldo: ${item.salario_ofrecido}</Text>

                        {item.estado === 'Activa' && <Text style={styles.urgent}>Activa!</Text>}
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ height: 30 }} />}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
    company: { fontSize: 16, color: '#64748B', marginTop: 5 },
    urgent: { color: '#038c25', fontWeight: 'bold', marginTop: 5 }
});

export default VacantesScreen;