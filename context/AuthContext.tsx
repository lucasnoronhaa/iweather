import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../lib/supabase'; // Importa nosso cliente
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<{ session: Session | null; loading: boolean }>({
    session: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    
      useEffect(() => {
    // Tenta pegar a sessão que já pode existir no AsyncStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouve em tempo real as mudanças no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpa a inscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente em outras telas
export const useAuth = () => {
  return useContext(AuthContext);
};