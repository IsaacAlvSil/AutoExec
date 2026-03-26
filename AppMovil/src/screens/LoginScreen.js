import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation, onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <LinearGradient
            colors={['#0F172A', '#1E293B', '#334155']}
            style={styles.container}
        >
            <SafeAreaView style={styles.innerContainer}>

                <View style={styles.headerContainer}>
                    <Text style={styles.brandTitle}>AutoExec</Text>
                    <Text style={styles.brandSubtitle}>Sistema de Gestión de Personal</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                    <Text style={styles.cardSubtitle}>Ingresa tus credenciales para continuar</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Correo Electrónico</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="tu@empresa.com"
                                placeholderTextColor="#94A3B8"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Contraseña</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.optionsRow}>

                        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
                        <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.registerLink}>Regístrate aquí</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.footerText}>© 2026 AutoExec. Todos los derechos reservados.</Text>

            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    brandSubtitle: {
        fontSize: 12,
        color: '#CBD5E1',
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 25,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#FAFAFA',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#0F172A',
        fontSize: 15,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 6,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    loginBtn: {
        backgroundColor: '#0F172A',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        fontSize: 13,
        color: '#64748B',
    },
    registerLink: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 40,
    }
});

export default LoginScreen;