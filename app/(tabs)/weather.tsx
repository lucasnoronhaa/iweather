import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import { get5DayForecast, getWeatherByCoords } from '../../scripts/weatherApi';

export default function WeatherScreen() {
    const { lat, lon, city } = useLocalSearchParams<{ lat: string; lon: string; city: string }>();
    console.log("Parâmetros recebidos na tela de clima:", { lat, lon, city });

    // 1. Definir interfaces para a resposta da API
    interface WeatherData {
        name: string;
        sys: {
            country: string;
        };
        main: {
            temp: number;
            temp_min: number;
            temp_max: number;
            feels_like: number;
            humidity: number;
        };
        weather: {
            description: string;
            main: string; // Ex: "Clouds", "Clear", "Rain"
        }[];
        wind: {
            speed: number;
        };
        // Adicionando os campos que vêm da API One Call
        current: {
            temp: number;
            feels_like: number;
            humidity: number;
            wind_speed: number;
            weather: {
                description: string;
                main: string;
            }[];
        };
        daily: any[]; // Simplificando por agora, mas pode ser tipado
    }

    // Interface para os itens da lista de previsão
    interface ForecastListItem {
        dt: number;
        main: {
            temp_max: number;
            temp_min: number;
        };
        weather: {
            main: string;
        }[];
    }

    // 2. Tipar os estados
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [forecastData, setForecastData] = useState<ForecastListItem[]>([]);

    useEffect(() => {
    const loadWeatherData = async () => {
        setError(null); // Limpa erros anteriores ao iniciar uma nova busca
        if (!lat || !lon) return; // Não faz nada se não tiver lat/lon

        try {
            setLoading(true); // Avisa que estamos começando a carregar
            const data = await getWeatherByCoords(lat, lon);
            const forecastData = await get5DayForecast(lat, lon);
            console.log("DADOS DO TEMPO:", data);
            setWeatherData(data);
            setForecastData(forecastData); 
        } catch (err) {
            // 3. Tratamento de erro mais seguro
            setError("Não foi possível carregar os dados do tempo. Verifique o nome da cidade e tente novamente.");
            setWeatherData(null); // <-- Limpa os dados antigos em caso de erro
        } finally {
            setLoading(false); // Avisa que terminamos de carregar (com sucesso ou erro)
        }
    };

    loadWeatherData();
}, [lat, lon]); // Este array faz o código rodar novamente se a cidade mudar

    // Função para obter a data atual formatada
    const getCurrentDate = () => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Mapeamento simples de condição para ícone (pode ser expandido)
    const weatherIconMap: { [key: string]: WeatherIconName } = {
        Clear: "weather-sunny",
        Clouds: "weather-cloudy",
        Rain: "weather-rainy",
        Drizzle: "weather-rainy",
    };
    type WeatherIconName =
        | "weather-sunny"
        | "weather-cloudy"
        | "weather-rainy"
        | "weather-night-partly-cloudy";

    type ForecastItem = {
        day: string;
        max: string;
        min: string;
        icon: WeatherIconName;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#8FB2F5" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#ff6b6b', fontSize: 18, textAlign: 'center', padding: 20 }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* 1. Card Principal */}
            <ImageBackground
                    source={require('../../assets/images/image.png')}
                style={styles.card}
                imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}
            >
                <Text style={styles.city}>{city || 'Carregando...'}</Text>
                {/* Usando data dinâmica */}
                <Text style={styles.date}>{getCurrentDate()}</Text>

                {/* Temperatura + Ícone */}
                <View style={styles.row}>
                    <View>
                        <Text style={styles.temp}>{Math.round(weatherData?.current?.temp ?? 0)}ºC</Text>
                        <Text style={styles.tempMinMax}>{Math.round(weatherData?.daily[0]?.temp?.min ?? 0)}°C / {Math.round(weatherData?.daily[0]?.temp?.max ?? 0)}°C</Text>
                        <Text style={styles.condition}>{weatherData?.current?.weather[0]?.description ?? 'Carregando...'}</Text>
                    </View>
                    {/* Usando ícone dinâmico */}
                    <MaterialCommunityIcons
                        name={weatherIconMap[weatherData?.current?.weather[0]?.main || ''] || 'weather-cloudy'}
                        size={64}
                        color="#fff"
                    />
                </View>
            </ImageBackground>

            {/* 2. Linha de Detalhes */}
            <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="thermometer" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Sensação térmica</Text>
                    <Text style={styles.detailValue}>{Math.round(weatherData?.current?.feels_like ?? 0)}°C</Text>
                </View>
                    
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-rainy" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Probabilidade de chuva</Text>
                    <Text style={styles.detailValue}>--%</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-windy" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Velocidade do vento</Text>
                    <Text style={styles.detailValue}>{weatherData?.current?.wind_speed} km/h</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="water-percent" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Umidade do ar</Text>
                    <Text style={styles.detailValue}>{weatherData?.current?.humidity}%</Text>
                </View>

                <View style={styles.detailRowUv}>
                    <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Índice UV</Text>
                    <Text style={styles.detailValue}>--</Text>
                </View>
            </View>

            {/* 3. Forecast */}
            <View style={styles.forecastList}>
                <FlatList
                    data={forecastData}
                    keyExtractor={(item) => item.dt.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.dayCard}>
                            {/* Transforma a data completa em dia da semana */}
                            <Text style={styles.dayText}>
                                {new Date(item.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').replace(/^\w/, c => c.toUpperCase())}
                            </Text>

                            {/* Ícone dinâmico */}
                            <MaterialCommunityIcons 
                                name={weatherIconMap[item.weather[0].main] || 'weather-cloudy'} 
                                size={30} 
                                color="#fff" 
                            />

                            {/* Usando a temperatura do item da previsão */}
                            <Text style={styles.maxTemp}>{Math.round(item.main.temp_max)}°</Text>
                            <Text style={styles.minTemp}>{Math.round(item.main.temp_min)}°</Text>
                        </View>
                    )}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#13131a",
        paddingHorizontal: 14,
        paddingTop: 50
    },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        overflow: "hidden"

    },
    mainCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
    },
    city: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    date: {
        fontSize: 14,
        color: "#d3d3d3",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },
    temp: {
        fontSize: 80,
        fontWeight: "bold",
        color: "#fff",
    },
    tempMinMax: {
        fontSize: 16,
        color: "#d3d3d3",
        textTransform: "capitalize",
        textAlign: "left"
    },
    condition: {
        fontSize: 16,
        color: "#bbb",
        marginTop: 2
    },
    detailsList: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a34"
    },
    detailRowUv: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10
    },
    detailText: {
        color: "#ddd",
        marginLeft: 10,
        fontSize: 14,
    },
    detailLabel: {
        flex: 1,
        marginLeft: 10,
        color: "#aaa",
        fontSize: 14
    },
    detailValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold"
    },
    forecastList: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 20,
    },
    dayCard: {
        backgroundColor: "#1c1c24",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        width: 70
    },
    dayText: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 6
    },
    maxTemp: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold"
    },
    minTemp: {
        color: "#aaa",
        fontSize: 14
    },
}
);
