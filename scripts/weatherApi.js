const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

export async function getWeatherByCity(city) {
    try {
        const response = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
        );
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Erro ao buscar dados do clima');
        }
    } catch (error) {
        console.error('Erro na API:', error);
        return null;
    }
}

export const get5DayForecast = async (city) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    if (!response.ok) {
        throw new Error('Não foi possivel obter a previsão dos próximos dias.');
}
    const data = await response.json();

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    return dailyForecasts;
}

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