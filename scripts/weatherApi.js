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