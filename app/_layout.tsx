// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getUserLastSearch } from '../scripts/weatherApi';
import { ActivityIndicator, View } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLastCity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const lastSearch = await getUserLastSearch(session.user.id);
        if (lastSearch) {
          // Se encontramos uma busca salva, navegamos direto para a tela de clima
          router.replace({ pathname: '/weather', params: lastSearch });
        }
      }
      setIsChecking(false); // Termina a verificação
    };

    checkLastCity();
  }, []);

  // Mostra um loading enquanto verificamos a última cidade
  if (isChecking) {
    return <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#13131a'}}><ActivityIndicator size="large" /></View>;
  }

  // Se não houver cidade salva, carrega as abas normalmente, começando pela busca.
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1c1c24', borderTopWidth: 0 },
        tabBarActiveTintColor: '#8FB2F5',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="weather" options={{ href: null }} /> 
    </Tabs>
  );
}