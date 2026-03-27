import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVacantes();
    }, []);

    const fetchVacantes = async () => {
        try {
            // Recuerda: usa tu IP (ej. 192.168.1.X:5000) si usas celular físico
            // o 10.0.2.2:5000 si usas el emulador de Android Studio
            const response = await fetch('http://192.168.1.72:5000/api/vacantes');
            const data = await response.json();
            setVacantes(data);
        } catch (error) {
            console.error("Error al cargar vacantes en Home:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#002E5D" />
                <Text style={{ marginTop: 10, color: '#666' }}>Cargando tu dashboard...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>¡Hola de nuevo!</Text>
                <Text style={styles.subtitle}>Aquí tienes las vacantes más recientes</Text>
            </View>

            <FlatList
                data={vacantes}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('DVacante', { vacante: item })}
                    >
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <Text style={styles.company}>{item.company}</Text>
                        {item.urgent && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>¡Urgente!</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9'
    },
    header: {
        marginVertical: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A'
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 5,
    },
    card: {
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A'
    },
    company: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 6
    },
    badge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 10
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    }
});

export default HomeScreen;