import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = () => {
    const [notificaciones, setNotificaciones] = useState([
        {
            id: '1',
            tipo: 'match',
            titulo: '¡Nuevo Top Match!',
            mensaje: 'Hay una nueva vacante de Plant Manager (Tier 1) que hace 92% de match con tu perfil.',
            tiempo: 'Hace 2 horas',
            leida: false,
        },
        {
            id: '2',
            tipo: 'estatus',
            titulo: 'Actualización de Solicitud',
            mensaje: 'Tu postulación para "Director de Supply Chain" ha sido revisada por la empresa.',
            tiempo: 'Hace 5 horas',
            leida: false,
        },
        {
            id: '3',
            tipo: 'mensaje',
            titulo: 'Mensaje de Reclutador',
            mensaje: 'Hola, nos gustaría agendar una entrevista técnica contigo para la próxima semana.',
            tiempo: 'Ayer',
            leida: true,
        },
        {
            id: '4',
            tipo: 'sistema',
            titulo: 'Perfil Verificado',
            mensaje: 'Tus documentos de certificación IATF 16949 han sido validados exitosamente.',
            tiempo: 'Hace 2 días',
            leida: true,
        },
    ]);

    const getIcono = (tipo) => {
        switch (tipo) {
            default: return { name: 'notifications', color: '#64748B' };
        }
    };

    const renderItem = ({ item }) => {
        const iconConfig = getIcono(item.tipo);

        return (
            <TouchableOpacity
                style={[styles.notificationCard, !item.leida && styles.tarjetaNoLeida]}
                onPress={() => console.log('Abrir notificación:', item.id)}
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
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['#0F172A', '#1E293B', '#334155']}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <TouchableOpacity onPress={() => console.log('Marcar todas como leídas')}>
                    <Text style={styles.markReadText}>Marcar leídas</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notificaciones}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    markReadText: {
        color: '#93C5FD',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
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
    tarjetaNoLeida: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
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
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    tituloNotificacion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
        paddingRight: 15,
    },
    mensajeNotificacion: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 6,
        lineHeight: 20,
    },
    tiempoTexto: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    }
});

export default NotificationsScreen;