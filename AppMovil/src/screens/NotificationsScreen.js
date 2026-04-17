import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API_URL from '../config';

const NotificationsScreen = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 1. NUEVO ESTADO PARA EL FILTRO ACTIVO
    const [filtroActivo, setFiltroActivo] = useState('todas');

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const fetchNotificaciones = async () => {
        try {
            // 1. Obtenemos tu correo guardado en el celular
            const storedEmail = await AsyncStorage.getItem('user_email');

            if (!storedEmail) {
                console.warn("No se encontró el correo del usuario logueado");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/notificaciones/usuario/email/${storedEmail}`);
            const data = await response.json();


            if (response.ok) {
                setNotificaciones(data);
            } else {
                console.error("Error del servidor:", data.detail);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchNotificaciones();
            setRefreshing(false);
        }, 1000);
    };

    // 5. FUNCIONES PARA ELIMINAR
    const confirmarEliminacion = (id) => {
        Alert.alert(
            "Eliminar Notificación",
            "¿Estás seguro de que deseas eliminar esta notificación?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => ejecutarEliminacion(id)
                }
            ]
        );
    };

    const ejecutarEliminacion = async (id) => {
        setNotificaciones((prev) => prev.filter(item => (item.id_notificacion || item.id) !== id));

        try {
            await fetch(`${API_URL}/api/notificaciones/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Error al eliminar en la BD:", error);
        }
    };

    const getIcono = (tipo) => {
        switch (tipo?.toLowerCase()) {
            case 'match': return { name: 'star', color: '#EAB308' };
            case 'estatus': return { name: 'time', color: '#3B82F6' };
            case 'mensaje': return { name: 'chatbubbles', color: '#10B981' };
            case 'sistema': return { name: 'settings', color: '#64748B' };
            default: return { name: 'notifications', color: '#64748B' };
        }
    };

    // 2. LÓGICA DE FILTRADO
    const notificacionesFiltradas = notificaciones.filter((item) => {
        if (filtroActivo === 'todas') return true;

        if (filtroActivo === 'nuevas') {

            const fechaBackend = item.fecha_creacion;

            if (!fechaBackend) return false;

            const fechaNotificacion = new Date(fechaBackend);
            const fechaActual = new Date();

            const diferenciaMilisegundos = fechaActual - fechaNotificacion;

            const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

            return diferenciaDias < 2;
        }

        if (filtroActivo === 'revision') {
            return item.tipo?.toLowerCase() === 'estatus';
        }

        return true;
    });

    const renderItem = ({ item }) => {
        const iconConfig = getIcono(item.tipo);
        const idNotificacion = item.id_notificacion || item.id;

        return (
            <TouchableOpacity
                style={[styles.notificationCard, !item.leida && styles.tarjetaNoLeida]}
                onPress={() => console.log('Abrir notificación:', idNotificacion)}
            >
                {!item.leida && <View style={styles.unreadDot} />}

                <View style={styles.iconContainer}>
                    <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.tituloNotificacion}>{item.titulo}</Text>
                    <Text style={styles.mensajeNotificacion} numberOfLines={2}>{item.mensaje}</Text>
                    <Text style={styles.tiempoTexto}>{item.tiempo}</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmarEliminacion(idNotificacion)}
                >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }]}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <TouchableOpacity onPress={() => console.log('Marcar todas como leídas')}>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity
                        style={[styles.filterTab, filtroActivo === 'todas' && styles.filterTabActive]}
                        onPress={() => setFiltroActivo('todas')}
                    >
                        <Text style={[styles.filterTabText, filtroActivo === 'todas' && styles.filterTabTextActive]}>Todas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filtroActivo === 'nuevas' && styles.filterTabActive]}
                        onPress={() => setFiltroActivo('nuevas')}
                    >
                        <Text style={[styles.filterTabText, filtroActivo === 'nuevas' && styles.filterTabTextActive]}>Nuevas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filtroActivo === 'revision' && styles.filterTabActive]}
                        onPress={() => setFiltroActivo('revision')}
                    >
                        <Text style={[styles.filterTabText, filtroActivo === 'revision' && styles.filterTabTextActive]}>En Revisión</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <FlatList
                data={notificacionesFiltradas}
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay notificaciones en esta categoría.</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        progressBackgroundColor="#ffffff"
                        tintColor="#ffffff"
                    />
                }
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    markReadText: {
        color: '#93C5FD',
        fontSize: 14,
        fontWeight: '600',
    },
    // Estilos nuevos para los filtros
    filterContainer: {
        paddingBottom: 15,
    },
    filterScroll: {
        paddingHorizontal: 20,
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterTabActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#60A5FA',
    },
    filterTabText: {
        color: '#94A3B8',
        fontWeight: '600',
        fontSize: 14,
    },
    filterTabTextActive: {
        color: '#FFFFFF',
    },
    emptyText: {
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    // Tus estilos anteriores
    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        position: 'relative',
    },
    tarjetaNoLeida: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
    unreadDot: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1, justifyContent: 'center' },
    tituloNotificacion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
        paddingRight: 15,
    },
    mensajeNotificacion: { fontSize: 14, color: '#475569', marginBottom: 6, lineHeight: 20 },
    tiempoTexto: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
    },
});

export default NotificationsScreen;