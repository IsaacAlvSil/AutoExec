import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const DVacante = ({ route, navigation }) => {

    const { vacante } = route.params || {
        vacante: {
            title: 'Director de Operaciones',
            company: 'AutoMotors SA',
            location: 'Ciudad de México',
            salary: '$180,000 - $220,000 MXN',
            type: 'Tiempo Completos',
            urgent: true,
            time: 'Hace 3 días',
            applicants: '12',
        }
    };

    const handlePostulacion = () => {
        Alert.alert(
            "¡Postulación Exitosa!",
            `Tu CV ha sido enviado correctamente para la vacante de ${vacante.title} en ${vacante.company}.`,
            [
                {
                    text: "Excelente",
                    style: "default",
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <View style={styles.iconBox}>
                            <MaterialCommunityIcons name="office-building" size={40} color="#334155" />
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.jobTitle}>{vacante.title}</Text>
                            <Text style={styles.companyName}>{vacante.company}</Text>
                            {vacante.urgent && (
                                <View style={styles.urgentBadge}>
                                    <Text style={styles.urgentText}>Urgente</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.infoList}>
                        <View style={styles.detailRow}>
                            <Ionicons name="location-outline" size={18} color="#64748B" />
                            <Text style={styles.detailValue}>{vacante.location}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="cash-outline" size={18} color="#64748B" />
                            <Text style={styles.detailValue}>{vacante.salary}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="briefcase-outline" size={18} color="#64748B" />
                            <Text style={styles.detailValue}>{vacante.type}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={18} color="#64748B" />
                            <Text style={styles.detailValue}>Publicado {vacante.time}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="people-outline" size={18} color="#64748B" />
                            <Text style={styles.detailValue}>{vacante.applicants} postulantes</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Requisitos</Text>
                    {[
                        'Título universitario en Ingeniería, Administración o afines',
                        'Mínimo 10 años de experiencia en la industria automotriz',
                        'Experiencia comprobada en puestos de dirección',
                        'Dominio del inglés (oral y escrito)',
                        'Habilidades excepcionales de liderazgo',
                        'Disponibilidad para viajar 30%'
                    ].map((item, index) => (
                        <View key={index} style={styles.requirementItem}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    ))}
                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Beneficios</Text>
                    <View style={styles.benefitsGrid}>
                        <View style={styles.benefitColumn}>
                            <Text style={styles.benefitText}>• Seguro médico mayor</Text>
                            <Text style={styles.benefitText}>• Bonos por desempeño</Text>
                            <Text style={styles.benefitText}>• Capacitación continua</Text>
                        </View>
                        <View style={styles.benefitColumn}>
                            <Text style={styles.benefitText}>• Fondo de ahorro</Text>
                            <Text style={styles.benefitText}>• Automóvil ejecutivo</Text>
                            <Text style={styles.benefitText}>• Plan de pensiones</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Proceso de Selección</Text>
                    {[
                        { step: '1', label: 'Postulación', time: '1 día' },
                        { step: '2', label: 'Revisión de perfil', time: '3-5 días' },
                        { step: '3', label: 'Evaluación técnica', time: '1 semana' },
                        { step: '4', label: 'Entrevistas', time: '2 semanas' },
                        { step: '5', label: 'Oferta', time: '3-5 días' },
                    ].map((item, index) => (
                        <View key={index} style={styles.processRow}>
                            <View style={styles.stepCircle}><Text style={styles.stepNumber}>{item.step}</Text></View>
                            <View>
                                <Text style={styles.stepLabel}>{item.label}</Text>
                                <Text style={styles.stepTime}>{item.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>

            <TouchableOpacity
                style={styles.applyButton}
                activeOpacity={0.8}
                onPress={handlePostulacion}
            >
                <Text style={styles.applyButtonText}>Postularme a esta vacante</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerRow: { flexDirection: 'row', marginBottom: 20 },
    iconBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, justifyContent: 'center' },
    headerText: { marginLeft: 15, flex: 1 },
    jobTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
    companyName: { fontSize: 16, color: '#64748B', marginVertical: 4 },
    urgentBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    urgentText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    infoList: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 15 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailValue: { marginLeft: 10, color: '#475569', fontSize: 15 },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 15 },
    requirementItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    itemText: { marginLeft: 10, color: '#475569', fontSize: 14, flex: 1, lineHeight: 20 },

    benefitsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    benefitColumn: { flex: 1 },
    benefitText: { color: '#475569', fontSize: 14, marginBottom: 8 },

    processRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    stepNumber: { fontWeight: 'bold', color: '#475569' },
    stepLabel: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    stepTime: { fontSize: 12, color: '#94A3B8' },

    applyButton: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#0F172A', padding: 20, alignItems: 'center'
    },
    applyButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default DVacante;