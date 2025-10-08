const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

  export const getWeatherData = async (lat, lon) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
        throw new Error("Não foi possível obter os dados do clima.");
    }

    const data = await response.json();
    return data;
};

export const searchCities = async (query) => {
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
}