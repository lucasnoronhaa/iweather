import 'react-native-url-polyfill/auto';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Se estiver carregando a sessão, não faz nada ainda

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // Se o usuário está logado E está na tela de login, redireciona para o app
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      // Se o usuário NÃO está logado E NÃO está na tela de login, redireciona para o login
      router.replace('/(auth)/login');
    }
  }, [session, loading, segments]);

  // Enquanto a sessão está sendo carregada, mostramos um indicador
  if (loading) {
      return <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#13131a'}}><ActivityIndicator size="large" /></View>;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}