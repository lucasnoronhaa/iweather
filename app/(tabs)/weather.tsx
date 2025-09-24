import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { FlatList, ImageBackground, StyleSheet, Text, View, ActivityIndicator  } from "react-native";
import { useState, useEffect } from 'react';
import { getWeatherByCity } from '../../scripts/weatherApi';

export default function WeatherScreen() {
    const {city} = useLocalSearchParams();

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const loadWeatherData = async () => {
        if (!city) return; // Não faz nada se não tiver uma cidade

        try {
            setLoading(true); // Avisa que estamos começando a carregar
            const data = await getWeatherByCity(city as string);
            setWeatherData(data);
        } catch (err) {
            setError(err.message); // Salva a mensagem de erro se a busca falhar
        } finally {
            setLoading(false); // Avisa que terminamos de carregar (com sucesso ou erro)
        }
    };

    loadWeatherData();
}, [city]); // Este array faz o código rodar novamente se a cidade mudar

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

    const forecast: ForecastItem[] = [
        {day: "Ter", max: "28°", min: "20°", icon: "weather-sunny"},
        {day: "Qua", max: "26°", min: "16°", icon: "weather-cloudy"},
        {day: "Qui", max: "30°", min: "25°", icon: "weather-rainy"},
        {day: "Sex", max: "25°", min: "20°", icon: "weather-night-partly-cloudy"},
        {day: "Sáb", max: "32°", min: "22°", icon: "weather-sunny"},
    ];

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
                <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
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
                <Text style={styles.city}>{wheaterData?.name}, {weatherData?.sys.country}</Text>
                <Text style={styles.date}>Segunda-feira, 15 de maio de 2023</Text>

                {/* Temperatura + Ícone */}
                <View style={styles.row}>
                    <View>
                        <Text style={styles.temp}>{Math.round(weatherData?.main?.temp)}</Text>
                        <Text style={styles.tempMinMax}>{Math.round(weatherData?.main?.temp_min)}C° / {Math.round(weatherData?.main?.temp_max)}C°</Text>
                        <Text style={styles.condition}>{weatherData?.weather[0]?.description}</Text>
                    </View>

                    <MaterialCommunityIcons
                        name="weather-night-partly-cloudy"
                        size={64}
                        color="#fff"
                    />
                </View>

                <Text style={styles.condition}>Parcialmente nublado</Text>
                
            </ImageBackground>

            {/* 2. Linha de Detalhes */}
            <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="thermometer" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Sensação térmica</Text>
                    <Text style={styles.detailValue}>{Math.round(weatherData?.main?.feels_like)}C°</Text>
                </View>
                    
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-rainy" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Probabilidade de chuva</Text>
                    <Text style={styles.detailValue}>10%</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="weather-windy" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Velocidade do vento</Text>
                    <Text style={styles.detailValue}>{weatherData?.wind?.speed} km/h</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="water-percent" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Umidade do ar</Text>
                    <Text style={styles.detailValue}>{weatherData?.main?.humidity}%</Text>
                </View>

                <View style={styles.detailRowUv}>
                    <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#aaa" />
                    <Text style={styles.detailLabel}>Índice UV</Text>
                    <Text style={styles.detailValue}>5</Text>
                </View>
            </View>

            {/* 3. Forecast */}
            <View style={styles.forecastList}>
                <FlatList
                    data={forecast}
                    keyExtractor={(item) => item.day}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.dayCard}>
                            <Text style={styles.dayText}>{item.day}</Text>
                            <MaterialCommunityIcons name={item.icon} size={30} color="#fff" />
                            <Text style={styles.maxTemp}>{item.max}</Text>
                            <Text style={styles.minTemp}>{item.min}</Text>
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
        paddingHorizontal: 14
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
