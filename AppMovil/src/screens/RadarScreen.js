import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RadarScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.tagContainer}>
                    <Text style={styles.dateText}>Hace 2 horas</Text>
                </View>

                <Text style={styles.title}>Nueva inversión en El Marqués: Tier 1 asiática anuncia planta de componentes para EV</Text>

                <View style={styles.locationRow}>
                    <Ionicons name="location" size={18} color="#6366F1" />
                    <Text style={styles.locationText}>Parque Industrial El Marqués, Querétaro</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.paragraph}>
                    Una importante empresa de nivel Tier 1, especializada en la manufactura de componentes electrónicos para vehículos eléctricos (EV), ha confirmado una inversión de $150 millones de dólares para la construcción de su nueva planta en la región del Bajío.
                </Text>

                <Text style={styles.paragraph}>
                    Se espera que la construcción comience en el tercer trimestre del año, generando más de 800 empleos directos en su primera fase. Esta decisión consolida al estado como un hub estratégico para la movilidad del futuro en Norteamérica.
                </Text>

                <View style={styles.impactBox}>
                    <Text style={styles.impactTitle}>Impacto en el talento</Text>
                    <Text style={styles.impactText}>
                        Se proyecta una alta demanda de perfiles bilingües (Inglés/Español) con experiencia en IATF 16949, gerencia de operaciones y supply chain internacional. Las primeras vacantes ejecutivas se abrirán en un par de meses.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    tagText: {
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateText: {
        color: '#94A3B8',
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        lineHeight: 32,
        marginBottom: 15,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationText: {
        color: '#475569',
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 26,
        marginBottom: 15,
    },
    impactBox: {
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    impactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#166534',
        marginBottom: 8,
    },
    impactText: {
        fontSize: 14,
        color: '#15803D',
        lineHeight: 22,
    }
});

export default RadarScreen;