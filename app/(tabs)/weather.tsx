import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { supabase } from '../../lib/supabase';
import { getWeatherData, updateUserLastSearch } from '../../scripts/weatherApi';

// Tipagem para os nomes dos ícones, para mais segurança
type WeatherIconName = "weather-sunny" | "weather-cloudy" | "weather-rainy" | "weather-night-partly-cloudy" | "weather-snowy" | "weather-fog" | "weather-lightning";

export default function WeatherScreen() {
    const { lat, lon, city } = useLocalSearchParams<{ lat: string; lon: string; city: string }>();

    // Tipagem para as chaves de condição e momento
    type WeatherCondition = 'Clear' | 'Clouds' | 'Rain' | 'Thunderstorm' | 'Drizzle' | 'Default';
    type Moment = 'day' | 'night';
    type BackgroundImagesType = {
        [key in WeatherCondition]: {
            [key in Moment]: any;
        };
    };

    // Mapa de imagens de fundo
    const backgroundImages: BackgroundImagesType = {
        Clear: {
            day: require('../../assets/images/Weather=Clear, Moment=Day.png'),
            night: require('../../assets/images/Weather=Clear, Moment=Night.png'),
        },
        Clouds: {
            day: require('../../assets/images/Weather=Cloudy, Moment=Day.png'),
            night: require('../../assets/images/Weather=Cloudy, Moment=Night.png'),
        },
        Rain: {
            day: require('../../assets/images/Weather=Rain, Moment=Day.png'),
            night: require('../../assets/images/Weather=Rain, Moment=Night.png'),
        },
        Thunderstorm: {
            day: require('../../assets/images/Weather=Storm, Moment=Day.png'),
            night: require('../../assets/images/Weather=Storm, Moment=Night.png'),
        },
        Drizzle: {
            day: require('../../assets/images/Weather=Rain, Moment=Day.png'),
            night: require('../../assets/images/Weather=Rain, Moment=Night.png'),
        },
        Default: {
            day: require('../../assets/images/Weather=Clear, Moment=Day.png'),
            night: require('../../assets/images/Weather=Clear, Moment=Night.png'),
        },
    };

    // Mapa de condições da API para nomes de ícones
    const weatherIconMap: { [key: string]: WeatherIconName } = {
        Clear: "weather-sunny",
        Clouds: "weather-cloudy",
        Rain: "weather-rainy",
        Drizzle: "weather-rainy",
        Thunderstorm: "weather-lightning",
        Snow: "weather-snowy",
        Mist: "weather-fog",
        Fog: "weather-fog",
    };

    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState(backgroundImages.Default.day);

    useEffect(() => {
        const loadWeatherData = async () => {
            try {
                if (!lat || !lon) {
                    setError("Latitude ou longitude não fornecidas.");
                    setLoading(false);
                    return;
                }
                const data = await getWeatherData(lat, lon);
                setWeatherData(data);

                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                // Salva os parâmetros da busca atual (city, lat, lon) no perfil do usuário
                updateUserLastSearch(session.user.id, { city, lat, lon });
            }

                if (data && data.current) {
                    const currentTime = data.current.dt;
                    const sunrise = data.current.sunrise;
                    const sunset = data.current.sunset;
                    const moment: Moment = (currentTime > sunrise && currentTime < sunset) ? 'day' : 'night';
                    // Garante que a condição seja uma das chaves válidas
                    const rawCondition = data.current.weather[0].main as string;
                    const condition: WeatherCondition = (['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Drizzle', 'Snow', 'Mist'].includes(rawCondition) ? rawCondition : 'Default') as WeatherCondition;

                    const background = backgroundImages[condition][moment] || backgroundImages.Default[moment];
                    setBackgroundImage(background);
                }
            } catch (err) {
                setError("Não foi possível carregar os dados do tempo.");
            } finally {
                setLoading(false);
            }
        };

        loadWeatherData();
    }, [lat, lon]);

    const getCurrentDate = () => new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#8FB2F5" /></View>;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={backgroundImage} style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]} />
                <Text style={styles.city}>{city || weatherData?.timezone.split('/')[1].replace('_', ' ')}</Text>
                <Text style={styles.date}>{getCurrentDate()}</Text>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.temp}>{Math.round(weatherData?.current?.temp ?? 0)}ºC</Text>
                        <Text style={styles.tempMinMax}>{Math.round(weatherData?.daily[0]?.temp?.min ?? 0)}°C / {Math.round(weatherData?.daily[0]?.temp?.max ?? 0)}°C</Text>
                        <Text style={styles.condition}>{weatherData?.current?.weather[0]?.description ?? 'Carregando...'}</Text>
                    </View>
                    <MaterialCommunityIcons name={weatherIconMap[weatherData?.current?.weather[0]?.main || ''] || 'weather-cloudy'} size={80} color="#fff" />
                </View>
            </View>

            <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="thermometer" size={20} color="#aaa" />

                    <Text style={styles.detailLabel}>Sensação térmica</Text>
                    <Text style={styles.detailValue}>{Math.round(weatherData?.current?.feels_like ?? 0)}°C</Text>

                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-rainy" size={20} color="#aaa" />

                    <Text style={styles.detailLabel}>Probabilidade de chuva</Text>
                    <Text style={styles.detailValue}>{weatherData?.daily[0] ? `${(weatherData.daily[0].pop * 100).toFixed(0)}%` : '--%'}</Text>

                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-windy" size={20} color="#aaa" />

                    <Text style={styles.detailLabel}>Velocidade do vento</Text>
                    <Text style={styles.detailValue}>{weatherData?.current?.wind_speed?.toFixed(1) ?? '--'} km/h</Text>

                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="water-percent" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Umidade do ar</Text>
                    <Text style={styles.detailValue}>{weatherData?.current?.humidity}%</Text>
                </View>

                <View style={styles.detailRowUv}>
                    <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Índice UV</Text>
                    <Text style={styles.detailValue}>{weatherData?.current?.uvi}</Text>
                </View>
            </View>

            <View style={styles.forecastList}>
                <FlatList
                    data={weatherData?.daily}
                    keyExtractor={(item) => item.dt.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        if (index === 0) return null;
                        if (index > 5) return null;
                        return (
                            <View style={styles.dayCard}>
                                <Text style={styles.dayText}>{new Date(item.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').replace(/^\w/, c => c.toUpperCase())}</Text>
                                <MaterialCommunityIcons name={weatherIconMap[item.weather[0].main] || 'weather-cloudy'} size={30} color="#fff" />
                                <Text style={styles.maxTemp}>{Math.round(item.temp.max)}°</Text>
                                <Text style={styles.minTemp}>{Math.round(item.temp.min)}°</Text>
                            </View>
                        );
                    }}
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
    errorText: {
        color: '#ff6b6b',
        fontSize: 18,
        textAlign: 'center',
        padding: 20
    },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        overflow: "hidden"
    },
    city: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff"
    },
    date: {
        fontSize: 14,
        color: "#d3d3d3"
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
        color: "#fff"
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
        marginTop: 2,
        textTransform: 'capitalize'
    },
    detailsList: {
        backgroundColor: "#1c1c24",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12
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
        padding: 20
    },
    dayCard: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
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
});