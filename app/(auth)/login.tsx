import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para realizar o login
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Erro no Login', error.message);
    }
    // Se o login for bem-sucedido, o onAuthStateChange no AuthContext vai detectar
    // a nova sessão e o _layout.tsx vai redirecionar automaticamente.
    setLoading(false);
  };

    // Função para realizar o cadastro
  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } else if (!data.session) {
      Alert.alert('Cadastro realizado', 'Por favor, verifique seu email para confirmar a conta!');
    }
    setLoading(false);
  };

  // Função para recuperação de senha
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Recuperação de Senha', 'Por favor, digite seu email no campo acima para recuperar a senha.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp://192.168.0.1:8081', // URL para onde o usuário será redirecionado após clicar no link do email. Ajuste conforme necessário.
    });
    if (error) Alert.alert('Erro', error.message);
    else Alert.alert('Verifique seu Email', 'Um link para redefinir sua senha foi enviado para o seu email.');
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
        <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 20 }}>
          <Text style={{ color: '#aaa', textAlign: 'center' }}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>
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