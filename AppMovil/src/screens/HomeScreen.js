import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API_URL from '../config';


const HomeScreen = ({ navigation }) => {
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Usuario');
    const [userInitials, setUserInitials] = useState('U');
    const [procesosActivos, setProcesosActivos] = useState(0);
    const [totalPostulaciones, setTotalPostulaciones] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);

        await fetchVacantes();
        await cargarDatosUsuario();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchVacantes();
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('user_email');
            const storedUserId = await AsyncStorage.getItem('user_id');

            if (storedEmail) {
                const emailName = storedEmail.split('@')[0];
                const nombreFormateado = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                setUserName(nombreFormateado);
                setUserInitials(nombreFormateado.substring(0, 2).toUpperCase());
            }

            if (storedUserId) {
                fetchProcesosActivos(storedUserId);
                fetchTotalPostulaciones(storedUserId);
            }
        } catch (error) {
            console.error('Error cargando usuario:', error);
        }
    };

    const fetchTotalPostulaciones = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/postulaciones/usuario/${userId}/total`);
            if (response.ok) {
                const data = await response.json();
                setTotalPostulaciones(data.total);
            }
        } catch (error) {
            console.error('Error fetching total postulaciones:', error);
        }
    };

    const fetchVacantes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/vacantes`);
            const data = await response.json();

            if (response.ok) {
                setVacantes(data);
            } else {
                Alert.alert('Error', 'No se pudieron cargar las vacantes');
            }
        } catch (error) {
            console.error('Error fetching vacantes:', error);
            Alert.alert('Error de conexión', 'Revisa que tu servidor esté encendido y la IP sea correcta.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProcesosActivos = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/postulaciones/usuario/${userId}/activas`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (response.ok) {
                const data = await response.json();

                setProcesosActivos(data.procesos_activos);
            } else {
                console.log("Error en status de procesos activos:", response.status);
            }
        } catch (error) {
            console.error('Error fetching procesos activos:', error);
        }
    };

    return (

        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.mainContainer} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ffffff']} tintColor="#dedede" />}>

                <View style={styles.greetingSection}>
                    <View>
                        <Text style={styles.greetingText}>Hola, {userName}</Text>
                        <Text style={styles.subtitleText}>Tu radar ejecutivo está activo</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity 
                            style={styles.qrButton}
                            onPress={() => navigation.navigate('QRScanner')}
                        >
                            <Ionicons name="qr-code-outline" size={20} color="#FFF" />
                            <Text style={styles.qrButtonText}>Escanear QR</Text>
                        </TouchableOpacity>
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity>
                                {/* variable userInitials */}
                                <Text onPress={() => navigation.navigate('Perfil')} style={styles.avatarText}>{userInitials}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Sección de Métricas*/}
                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <Ionicons name="send-outline" size={24} color="#3B82F6" style={styles.metricIcon} />
                        <Text style={styles.metricNumber}>{totalPostulaciones}</Text>
                        <Text style={styles.metricLabel}>Postulaciones{'\n'}Enviadas</Text>
                    </View>

                    {/* Búsquedas Top */}
                    <View style={styles.metricCard}>
                        <Ionicons name="search-outline" size={24} color="#10B981" style={styles.metricIcon} />
                        <Text style={styles.metricNumber}>{vacantes.length}</Text>
                        <Text style={styles.metricLabel}>Búsquedas{'\n'}Top</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Ionicons name="briefcase-outline" size={24} color="#F59E0B" style={styles.metricIcon} />
                        <Text style={styles.metricNumber}>{procesosActivos}</Text>
                        <Text style={styles.metricLabel}>Procesos{'\n'}Activos</Text>
                    </View>
                </View>

                {/* Sección de Oportunidades */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Oportunidades Top Match</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Solicitudes')}>
                        <Text style={styles.seeAllText}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de Tarjetas de Vacantes */}
                <View style={styles.vacanciesContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
                    ) : (
                        vacantes.length > 0 ? (
                            vacantes.map((job, index) => (
                                <TouchableOpacity
                                    key={job.id_vacante || index.toString()}
                                    style={styles.jobCard}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('DVacante', { vacante: job })}
                                >
                                    <View style={styles.jobHeader}>
                                        <Text style={styles.jobTitle}>{job.titulo}</Text>
                                        <View style={styles.matchBadge}>
                                            <Text style={styles.matchText}>Nuevo</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.jobLocation}>Sueldo: ${job.salario_ofrecido}</Text>
                                    <Text style={styles.jobDescription} numberOfLines={3}>
                                        {job.descripcion}
                                    </Text>

                                    <View style={styles.tagsRow}>
                                        <View style={styles.tagBadge}>
                                            <Text style={styles.tagText}>{job.estado}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>
                                No hay vacantes disponibles.
                            </Text>
                        )
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    greetingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    greetingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
        color: '#94A3B8',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrButton: {
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
        marginRight: 15,
    },
    qrButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    metricCard: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 15,
        width: '31%',
        alignItems: 'center',
    },
    metricIcon: {
        marginBottom: 8,
    },
    metricNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    seeAllText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
    vacanciesContainer: {
        paddingHorizontal: 20,
    },
    jobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        flex: 1,
        marginRight: 10,
    },
    matchBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    matchText: {
        color: '#059669',
        fontSize: 12,
        fontWeight: 'bold',
    },
    jobLocation: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    jobDescription: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
        marginBottom: 15,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
    }
});

export default HomeScreen;