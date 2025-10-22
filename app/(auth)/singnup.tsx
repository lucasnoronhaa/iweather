import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from 'expo-router';

export default function SingUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Para navegação após o cadastro

    // Função para realizar o cadastro do usuário
    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert('Erro no Cadastro', error.message);
        } else if (!data.session) {
            Alert.alert(
                'Cadastro realizado!',
                'Verifique seu email para confirmar a conta! Após confirmar, retorne e faça o login.',
                [{ text: 'OK', onPress: () => router.back() }] // Botão para voltar à tela de login
            );
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha (mínimo 6 caracteres)"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleSignUp} disabled={loading} />
            </View>

            {/* Link para voltar ao login */}
            <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={{ marginTop: 20 }}>
                    <Text style={{ color: '#aaa', textAlign: 'center' }}>
                        Já tem uma conta? Entrar
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

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
        marginBottom: 30
    },

    input: {
        backgroundColor: '#1E1E2D',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15
    },

    buttonContainer: {
        marginVertical: 10
    },
});