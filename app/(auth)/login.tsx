import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // A lógica de login com Supabase vem a seguir
        Alert.alert('Login', `Tentando entrar com: ${email}`);
        setLoading(false);
    };

    const handleSignUp = async () => {
        setLoading(true);
        // A lógica de cadastro com Supabase vem a seguir
        Alert.alert('Cadastro', `Tentando cadastrar com: ${email}`);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>☁️ iWeather</Text>
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
                placeholder="Senha"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
        <View style={styles.buttonContainer}>
            <Button title={loading ? 'Carregando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
        </View>
        <View style={styles.buttonContainer}>
            <Button title={loading ? "Carregando..." : "Cadastrar"} onPress={handleSignUp} disabled={loading} color="#555" />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#13131a',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#1E1E2D',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonContainer: {
        marginVertical: 5,
    },
});