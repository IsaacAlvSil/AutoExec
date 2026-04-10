import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { API_URL } from '../config';

const SignUpScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nombre || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor llena todos los campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    id_rol: 2
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    '¡Registro Exitoso!',
                    'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert('Error en el registro', data.detail || 'No se pudo crear la cuenta.');
            }
        } catch (error) {
            Alert.alert(
                'Error de conexión',
                'No se pudo conectar con el servidor. Verifica tu red.'
            );
            console.error('Error en registro:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        <View style={styles.iconHeader}>
                            <Ionicons name="person-add" size={40} color="#0F172A" />
                        </View>

                        <Text style={styles.title}>Registro de Candidato</Text>
                        <Text style={styles.subtitle}>Crea tu cuenta para encontrar las mejores vacantes</Text>

                        {/* Campo: Nombre */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre completo"
                                placeholderTextColor="#94A3B8"
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>

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

                        {/* Campo: Contraseña */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        {/* Campo: Confirmar Contraseña */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        {/* Botón Principal: Crear Cuenta */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
                            )}
                        </TouchableOpacity>

                        {/* Botón Secundario: Volver al Login */}
                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.linkText}>Inicia Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 16, alignItems: 'center', width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    iconHeader: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#64748B', marginBottom: 30, textAlign: 'center', paddingHorizontal: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, width: '100%', height: 50 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: '#0F172A', fontSize: 15 },
    primaryButton: { backgroundColor: '#3B82F6', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10, height: 50, justifyContent: 'center', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    footerRow: { flexDirection: 'row', marginTop: 25, alignItems: 'center' },
    footerText: { color: '#64748B', fontSize: 14 },
    linkText: { color: '#0F172A', fontSize: 14, fontWeight: 'bold' }
});

export default SignUpScreen;