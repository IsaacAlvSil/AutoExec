import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const VACANCIES = [
    {
        id: '1',
        title: 'Director de Operaciones',
        company: 'AutoMotors SA',
        location: 'Ciudad de México',
        salary: '$180,000 - $220,000 MXN',
        type: 'Tiempo Completo',
        urgent: true,
        time: 'Hace 2 días',
        applicants: '12',
    },
    {
        id: '2',
        title: 'Gerente de Ventas Regional',
        company: 'Global Auto Parts',
        location: 'Monterrey, NL',
        salary: '$150,000 - $180,000 MXN',
        type: 'Tiempo Completo',
        urgent: false,
        time: 'Hace 5 días',
        applicants: '24',
    },
    {
        id: '3',
        title: 'VP de Manufactura',
        company: 'TechCar Industries',
        location: 'Guadalajara, JAL',
        salary: '$200,000 - $250,000 MXN',
        type: 'Tiempo Completo',
        urgent: true,
        time: 'Hace 1 semana',
        applicants: '8',
    },
    {
        id: '4',
        title: 'Director de Calidad',
        company: 'Premium Motors',
        location: 'Querétaro, QRO',
        salary: '$160,000 - $190,000 MXN',
        type: 'Tiempo Completo',
        urgent: false,
        time: 'Hace 3 días',
        applicants: '15',
    },
    {
        id: '5',
        title: 'Gerente de Supply Chain',
        company: 'AutoLogistics Corp',
        location: 'Puebla, PUE',
        salary: '$140,000 - $170,000 MXN',
        type: 'Tiempo Completo',
        urgent: false,
        time: 'Hace 4 días',
        applicants: '19',
    },
];


const VacancyCard = ({ item, navigation }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
            {item.urgent && (
                <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>Urgente</Text>
                </View>
            )}
        </View>

        <View style={styles.infoRow}><MaterialCommunityIcons name="office-building" size={16} color="#64748B" /><Text style={styles.infoText}>{item.company}</Text></View>
        <View style={styles.infoRow}><Ionicons name="location-outline" size={16} color="#64748B" /><Text style={styles.infoText}>{item.location}</Text></View>
        <View style={styles.infoRow}><Ionicons name="cash-outline" size={16} color="#64748B" /><Text style={styles.infoText}>{item.salary}</Text></View>
        <View style={styles.infoRow}><Ionicons name="briefcase-outline" size={16} color="#64748B" /><Text style={styles.infoText}>{item.type}</Text></View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
            <Text style={styles.footerText}>🕒 {item.time}  •  {item.applicants} postulantes</Text>

            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('DVacante', { vacante: item })}
            >
                <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const RequestsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }}>
            <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Vacantes</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#64748B" />
                        <TextInput placeholder="Buscar vacantes..." style={styles.searchInput} placeholderTextColor="#64748B" />
                    </View>
                    <TouchableOpacity style={styles.filterIconButton}>
                        <Ionicons name="options-outline" size={22} color="#0F172A" />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <Text style={styles.statsText}>5 vacantes disponibles</Text>
                    <TouchableOpacity style={styles.sortButton}>
                        <Text style={styles.sortText}>Más recientes </Text>
                        <Ionicons name="chevron-down" size={14} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {VACANCIES.map((vacancy) => (
                        <VacancyCard
                            key={vacancy.id}
                            item={vacancy}
                            navigation={navigation}
                        />
                    ))}
                </ScrollView>

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },

    searchSection: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 15 },
    searchBar: { flex: 1, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 10, height: 48 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
    filterIconButton: { backgroundColor: 'white', width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    statsText: { color: '#94A3B8', fontSize: 14 },
    sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    sortText: { color: 'white', fontSize: 13, fontWeight: '600' },

    scrollContent: { paddingHorizontal: 15, paddingBottom: 30 },
    card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    jobTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 10 },
    urgentBadge: { backgroundColor: '#FF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    urgentText: { color: 'white', fontSize: 11, fontWeight: 'bold' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
    infoText: { color: '#475569', fontSize: 14 },

    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

    cardFooter:
    {
        justifyContent: 'space-between', alignItems: 'center',
        marginTop: -10
    },
    footerText: { color: '#64748B', fontSize: 12 },
    detailsButton: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 8,
    },
    detailsButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
});

export default RequestsScreen;