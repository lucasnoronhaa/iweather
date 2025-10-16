import { supabase } from '../lib/supabase';
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

  export const getWeatherData = async (lat: string, lon: string) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
        throw new Error("Não foi possível obter os dados do clima.");
    }

    const data = await response.json();
    return data;
};

export const searchCities = async (query: string) => {
    if (query.length < 3) return []; // Busca com pelo menos 3 caracteres

    try {
        const response = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        return [];
    }
};

export const updateUserLastSearch = async (userId: string, searchParams: object) => {
  const { error } = await supabase
    .from('profiles')
    .update({ last_search: searchParams })
    .eq('id', userId);

  if (error) {
    console.error('Erro ao salvar a última busca:', error);
  }
};

export const getUserLastSearch = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('last_search')
    .eq('id', userId)
    .single(); // Pega apenas um resultado

  if (error && error.code !== 'PGRST116') { // Ignora erro de "nenhuma linha encontrada"
    console.error('Erro ao buscar a última pesquisa:', error);
  }
  return data?.last_search || null;
};