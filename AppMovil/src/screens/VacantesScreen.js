import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import API_URL from '../config';

const VacantesScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(async () => {
            await fetchVacantes();
            setRefreshing(false);
        }, 1000);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0F172A', '#1E293B', '#46576e']}
            style={styles.container}
        >

            <FlatList
                data={vacantes}
                keyExtractor={(item) => (item.id_vacante ? item.id_vacante.toString() : Math.random().toString())}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        progressBackgroundColor="#f5f5f5"
                        tintColor="#ffffff"
                    />
                }

                renderItem={({ item }) => {
                    const isActiva = item.estado?.toLowerCase() === 'activa';

                    return (
                        <TouchableOpacity
                            style={[styles.card, !isActiva && styles.cardInactive]}
                            activeOpacity={0.7}
                            disabled={!isActiva}
                            onPress={() => navigation.navigate('DVacante', { vacante: item })}
                        >
                            <Text style={[styles.jobTitle, !isActiva && styles.textInactive]}>
                                {item.titulo}
                            </Text>

                            <Text style={styles.company}>Sueldo: ${item.salario_ofrecido}</Text>

                            {isActiva ? (
                                <Text style={styles.urgent}>Activa</Text>
                            ) : (
                                <Text style={styles.closed}>Inactiva</Text>
                            )}
                        </TouchableOpacity>
                    );
                }}
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
    cardInactive: {
        backgroundColor: '#E2E8F0',
        opacity: 0.8,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A'
    },
    textInactive: {
        color: '#94A3B8',
    },
    company: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 5
    },
    urgent: {
        color: '#038c25', // Verde
        fontWeight: 'bold',
        marginTop: 8
    },
    closed: {
        color: '#EF4444', // Rojo
        fontWeight: 'bold',
        marginTop: 8
    }
});

export default VacantesScreen;