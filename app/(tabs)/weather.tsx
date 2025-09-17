import { View, Text, StyleSheet, ImageBackground, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WeatherScreen() {
    const {city} = useLocalSearchParams();

    type WeatherIconName =
        | "weather-sunny"
        | "weather-cloudy"
        | "weather-rainy"
        | "weather-night-partly-cloudy";

    type ForecastItem = {
        day: string;
        temp: string;
        icon: WeatherIconName;
    };

    const forecast: ForecastItem[] = [
        {day: "Ter", temp: "28º / 20º", icon: "weather-sunny"},
        {day: "Qua", temp: "26º / 19º", icon: "weather-cloudy"},
        {day: "Qui", temp: "24º/ 18º", icon: "weather-rainy"},
        {day: "Sex", temp: "25º/ 17º", icon: "weather-night-partly-cloudy"},
        {day: "Sáb", temp: "26º/ 21º", icon: "weather-sunny"},
    ];

    return (
        <View style={styles.container}>
            {/* Card de clima */}
            <ImageBackground
                source={require('../../assets/images/image.png')}
                style={styles.card}
                imageStyle={{ borderRadius: 10, objectFit: 'cover', height: '100%', width: '100%' }}
                >
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.date}>Segunda-feira, 15 de maio de 2023</Text>

                {/* Temperatura + Ícone */}
                <View style={styles.row}>
                    <Text style={styles.temp}>28ºC</Text>
                    <MaterialCommunityIcons name="weather-night-partly-cloudy" size={64} color="#fff" />
                </View>
                <Text style={styles.condition}>Parcialmente nublado</Text>
            </ImageBackground>

                {/* Card com outros detalhes */}
            <View style={styles.detailsRow}>
                <View style={styles.detailCard}>
                    <MaterialCommunityIcons name="thermometer" size={20} color="#fff" />
                    <Text style={styles.detailText}>Sensação térmica: 30ºC</Text>
                </View>
                    
                <View style={styles.detailCard}>
                    <MaterialCommunityIcons name="weather-rainy" size={20} color="#fff" />
                    <Text style={styles.detailText}>Probabilidade de chuva: 0%</Text>
                </View>

                <View style={styles.detailCard}>
                    <MaterialCommunityIcons name="weather-windy" size={20} color="#fff" />
                    <Text style={styles.detailText}>Velocidade do vento: 8 km/h</Text>
                </View>

                <View style={styles.detailCard}>
                    <MaterialCommunityIcons name="water-percent" size={20} color="#fff" />
                    <Text style={styles.detailText}>Umidade do ar 40%</Text>
                </View>

                <View style={styles.detailCard}>
                    <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#fff" />
                    <Text style={styles.detailText}>Índice UV 5</Text>
                </View>
            </View>

                {/* Próximos dias */}
            <View style={styles.nextDays}>
                <FlatList
                    data={forecast}
                    keyExtractor={(item) => item.day}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.dayCard}>
                            <Text style={styles.dayText}>{item.day}</Text>
                            <MaterialCommunityIcons name={item.icon} size={35} color="#fff" />
                            <Text style={styles.dayText}>{item.temp}</Text>
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
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 30,
    },
    card: {
        width: "95%",
        backgroundColor: "#1c1c24",
        padding: 20,
        borderRadius: 10,
        alignItems: "flex-start"
    },
    city: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff"
    },
    date: {
        fontSize: 14,
        color: "#aaa",
        marginBottom: 10
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10
    },
    temp: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#fff"
    },
    condition: {
        fontSize: 18,
        color: "#aaa",
        marginTop: 8
    },
    detailsRow: {
        width: "95%",
        marginTop: 12
    },
    detailCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1c1c24",
        marginVertical: 6,
        padding: 20,
        borderRadius: 14,
    },
    detailText: {
        color: "#ddd",
        marginLeft: 6,
        fontSize: 12,
    },
    nextDays: {
        marginTop: 20,
        paddingLeft: 10,
        width: "100%",
    },
    dayCard: {
        backgroundColor: "#1c1c24",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        width: 80,
    },
    dayText: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        padding: 4,
        marginBottom: 6
    },
    tempText: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 6
    },
});