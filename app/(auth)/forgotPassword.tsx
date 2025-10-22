// app/(auth)/forgotPassword.tsx
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert("Atenção", "Por favor, digite seu email.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // redirectTo: 'seu-app://reset-password', // Para link direto no app (mais avançado)
        });

        if (error) {
            Alert.alert("Erro", error.message);
        } else {
            Alert.alert(
                "Verifique seu email",
                "Se existir uma conta, um link para redefinir a senha foi enviado.",
                [{ text: 'OK', onPress: () => router.back() }] // Botão para voltar ao login
            );
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redefinir Senha</Text>
            <Text style={styles.subtitle}>Digite seu email para receber o link de redefinição.</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <View style={styles.buttonContainer}>
                <Button title={loading ? "Enviando..." : "Enviar Link"} onPress={handlePasswordReset} disabled={loading} />
            </View>

            {/* Link para voltar ao Login */}
            <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={{ marginTop: 20 }}>
                    <Text style={{ color: '#aaa', textAlign: 'center' }}>
                        Voltar para o Login
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#13131a' 
    },

    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#fff', 
        textAlign: 'center', 
        marginBottom: 15 
    },

    subtitle: { 
        fontSize: 16, 
        color: '#aaa', 
        textAlign: 'center', 
        marginBottom: 30 
    },

    input: { 
        backgroundColor: '#1E1E2D', 
        color: '#fff', 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 20 
    },
    buttonContainer: { 
        marginVertical: 10 
    },
});