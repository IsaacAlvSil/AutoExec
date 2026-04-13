import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Asegúrate de importar la URL de tu API
import API_URL from '../config';

const DVacante = ({ route, navigation }) => {
    const { vacante } = route.params || {};

    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("🚨 ¡Botón presionado! Iniciando handleApply...");

    const handleApply = async () => {
        console.log("🚨 ¡Botón presionado! Iniciando handleApply...");
        setIsSubmitting(true);

        try {
            console.log("🚨 1. Intentando leer AsyncStorage...");
            const storedEmail = await AsyncStorage.getItem('user_email');
            console.log("🚨 Email obtenido:", storedEmail);

            if (!storedEmail) {
                Alert.alert("Error", "No se encontró una sesión activa.");
                setIsSubmitting(false);
                return;
            }

            console.log("🚨 2. Buscando perfil en el backend...");
            const urlBusqueda = `${API_URL}/api/perfiles/email/${storedEmail}`;
            const respuestaPerfil = await fetch(urlBusqueda);

            if (!respuestaPerfil.ok) {
                const rawError = await respuestaPerfil.text();
                console.log("🚨 Error crudo al buscar perfil:", rawError);
                Alert.alert("Aviso", "Necesitas completar tu perfil antes de postularte.");
                setIsSubmitting(false);
                return;
            }

            const datosPerfil = await respuestaPerfil.json();
            const idUsuarioActual = datosPerfil.id_usuario;
            console.log("🚨 Perfil encontrado. ID a usar:", idUsuarioActual);

            console.log("🚨 3. Enviando postulación...");
            const payload = {
                id_usuario: idUsuarioActual,
                id_vacante: vacante.id_vacante,
                id_estado: 1
            };
            console.log("🚨 Payload a enviar:", payload);

            const response = await fetch(`${API_URL}/api/postulaciones/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // 👇 LA CLAVE ESTÁ AQUÍ: Leemos como texto primero para evitar el error de la "I"
            const textResponse = await response.text();
            console.log("🚨 Respuesta cruda del servidor al postular:", textResponse);

            // Intentamos convertir ese texto a JSON
            let data;
            try {
                data = JSON.parse(textResponse);
            } catch (err) {
                console.log("🚨 El servidor no devolvió JSON. Posible caída de FastAPI.");
                Alert.alert("Error interno", "El servidor falló (500 Internal Server Error). Revisa la terminal de FastAPI.");
                setIsSubmitting(false);
                return;
            }

            if (response.ok) {
                Alert.alert(
                    "¡Postulación Exitosa!",
                    `Te has postulado correctamente a: ${vacante.titulo}.`,
                    [{ text: "Entendido", onPress: () => navigation.goBack() }]
                );
            } else if (response.status === 400) {
                Alert.alert("Aviso", data.detail || "Ya te has postulado a esta vacante.");
            } else {
                Alert.alert("Error", data.detail || "Hubo un problema al procesar tu postulación.");
            }

        } catch (error) {
            console.log("🚨 Error capturado en el CATCH:", error.message);
            Alert.alert("Error de conexión", "No se pudo conectar con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!vacante) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#FFFFFF' }}>Cargando información...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* ... TODO TU CÓDIGO DE LAS TARJETAS Y DETALLES SE QUEDA EXACTAMENTE IGUAL ... */}
                    <View style={styles.mainCard}>
                        {/* Estado y Fecha */}
                        <View style={styles.badgeRow}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{String(vacante.estado || 'Activa')}</Text>
                            </View>
                            <Text style={styles.dateText}>Publicada recientemente</Text>
                        </View>

                        {/* Título y Salario */}
                        <Text style={styles.jobTitle}>{String(vacante.titulo)}</Text>
                        <View style={styles.salaryRow}>
                            <Ionicons name="cash-outline" size={24} color="#3B82F6" />
                            <Text style={styles.salaryText}>
                                ${vacante.salario_ofrecido ? vacante.salario_ofrecido.toLocaleString() : '0'} MXN
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailsGrid}>
                            <View style={styles.detailsItem}>
                                <Ionicons name="location-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Ubicación</Text>
                                    <Text style={styles.detailsValue}>{vacante.ubicacion || 'No especificada'}</Text>
                                </View>
                            </View>
                            <View style={styles.detailsItem}>
                                <Ionicons name="briefcase-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Modalidad</Text>
                                    <Text style={styles.detailsValue}>{vacante.modalidad || 'No especificada'}</Text>
                                </View>
                            </View>
                            <View style={styles.detailsItem}>
                                <Ionicons name="language-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Inglés</Text>
                                    <Text style={styles.detailsValue}>{vacante.nivel_ingles || 'No especificado'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Responsabilidades del puesto</Text>
                        <Text style={styles.descriptionText}>
                            {String(vacante.descripcion || 'Sin descripción disponible.')}
                        </Text>
                    </View>

                    {/* Botón de Acción Actualizado */}
                    <TouchableOpacity
                        style={[styles.applyButton, isSubmitting && { backgroundColor: '#93C5FD' }]}
                        activeOpacity={0.8}
                        onPress={handleApply}
                        disabled={isSubmitting} // Evita el doble click
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.applyButtonText}>Postularme ahora</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

// ... TUS ESTILOS ...
const styles = StyleSheet.create({
    // ... TUS ESTILOS ANTERIORES SE QUEDAN IGUAL ...
    safeArea: { flex: 1, backgroundColor: '#0F172A' },
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
    scrollContent: { padding: 20 },
    mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 25, elevation: 10 },
    badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    statusText: { color: '#059669', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    dateText: { color: '#94A3B8', fontSize: 12 },
    jobTitle: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
    salaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    salaryText: { fontSize: 22, fontWeight: 'bold', color: '#3B82F6', marginLeft: 10 },
    divider: { height: 1, backgroundColor: '#F1F5F9', width: '100%', marginBottom: 20 },
    detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 5 },
    detailsItem: { flexDirection: 'row', alignItems: 'flex-start', width: '48%', marginBottom: 15 },
    detailsTextContainer: { marginLeft: 10, flex: 1 },
    detailsLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 2 },
    detailsValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    descriptionText: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 10 },
    applyButton: { backgroundColor: '#3B82F6', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 30 },
    applyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

    // 👇 SOLO AGREGA ESTE ESTILO NUEVO AL FINAL 👇
    applyButtonDisabled: {
        backgroundColor: '#93C5FD', // Un azul más claro para indicar que está inactivo
    }
});

export default DVacante;