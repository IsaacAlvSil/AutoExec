import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DVacante = ({ route, navigation }) => {
    // Recibimos la vacante con la nueva estructura limpia desde la BDD
    const { vacante } = route.params || {};

    const handleApply = () => {
        Alert.alert(
            "¡Postulación Exitosa!",
            `Te has postulado correctamente para la vacante: ${vacante.titulo}. El equipo de reclutamiento revisará tu perfil.`,
            [{ text: "Entendido", onPress: () => navigation.goBack() }]
        );
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
                {/* Header */}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

                        {/* ✅ GRID DE DETALLES ORDENADOS (Llamando directo a la BDD) */}
                        <View style={styles.detailsGrid}>

                            {/* Ubicación */}
                            <View style={styles.detailsItem}>
                                <Ionicons name="location-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Ubicación</Text>
                                    <Text style={styles.detailsValue}>{vacante.ubicacion || 'No especificada'}</Text>
                                </View>
                            </View>

                            {/* Modalidad */}
                            <View style={styles.detailsItem}>
                                <Ionicons name="briefcase-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Modalidad</Text>
                                    <Text style={styles.detailsValue}>{vacante.modalidad || 'No especificada'}</Text>
                                </View>
                            </View>

                            {/* Nivel de Inglés */}
                            <View style={styles.detailsItem}>
                                <Ionicons name="language-outline" size={20} color="#64748B" />
                                <View style={styles.detailsTextContainer}>
                                    <Text style={styles.detailsLabel}>Inglés</Text>
                                    <Text style={styles.detailsValue}>{vacante.nivel_ingles || 'No especificado'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.divider} />

                        {/* ✅ Descripción (Ahora contiene solo las responsabilidades) */}
                        <Text style={styles.sectionTitle}>Responsabilidades del puesto</Text>
                        <Text style={styles.descriptionText}>
                            {String(vacante.descripcion || 'Sin descripción disponible.')}
                        </Text>
                    </View>

                    {/* Botón de Acción */}
                    <TouchableOpacity style={styles.applyButton} activeOpacity={0.8} onPress={handleApply}>
                        <Text style={styles.applyButtonText}>Postularme ahora</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

// ESTILOS ACTUALIZADOS
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0F172A' },
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
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

    // ✅ GRID ACTUALIZADO PARA SOPORTAR VARIAS FILAS (flexWrap)
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Permite que los elementos pasen a la siguiente línea
        marginBottom: 5
    },
    detailsItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '48%',
        marginBottom: 15 // Espacio hacia abajo para la segunda fila (Inglés)
    },
    detailsTextContainer: { marginLeft: 10, flex: 1 },
    detailsLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 2 },
    detailsValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    descriptionText: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 10 },
    applyButton: { backgroundColor: '#3B82F6', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 30 },
    applyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default DVacante;