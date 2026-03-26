import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const RecoverPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#334155']}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        {/* Icono de candado / seguridad */}
                        <View style={styles.iconHeader}>
                            <Ionicons name="lock-closed" size={40} color="#0F172A" />
                        </View>

                        <Text style={styles.title}>Recuperar Contraseña</Text>
                        <Text style={styles.subtitle}>
                            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para restablecerla.
                        </Text>

                        {/* Campo: Correo */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor="#94A3B8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Botón Principal */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => console.log('Enviar correo de recuperación a:', email)}
                        >
                            <Text style={styles.primaryButtonText}>Enviar Instrucciones</Text>
                        </TouchableOpacity>

                        {/* Botón para regresar al Login */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={16} color="#64748B" />
                            <Text style={styles.backButtonText}>Volver al Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    iconHeader: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 30,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        width: '100%',
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#0F172A',
        fontSize: 15,
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backButtonText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    }
});

export default RecoverPasswordScreen;