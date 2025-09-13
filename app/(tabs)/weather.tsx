import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WeatherScreen() {
    const {city} = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Card de clima */}
            <View style={styles.card}>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.date}>Segunda-feira, 15 de maio de 2023</Text>

                    {/* Temperatura + Ícone */}
                <View style={styles.row}>
                    <Text style={styles.temp}>28ºC</Text>
                    <MaterialCommunityIcons name="weather-night-partly-cloudy" size={64} color="#fff" />
                </View>
                <Text style={styles.condition}>Parcialmente nublado</Text>
            </View>

                {/* Card com outros detalhes */}
            <View style={styles.detalhes}>
                <Text style={styles.detailText}>Sensação térmica: 30ºC</Text>
                <Text style={styles.detailText}>Probabilidade de chuva: 0%</Text>
                <Text style={styles.detailText}>Velocidade do vento: 8 km/h</Text>
                <Text style={styles.detailText}>Umidade do ar 40%</Text>
                <Text style={styles.detailText}>Índice UV 5</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#13131a",
        justifyContent: "center",
        alignItems: "center",
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
    detalhes: {
        marginTop: 8,
        width: "95%",
        backgroundColor: "#1c1c24",
        padding: 20,
        borderRadius: 10,
        alignItems: "flex-start"
    },
    detailText: {
        fontSize: 16,
        color: "#aaa",
        marginBottom: 4,
        textAlign: "justify"
    },
});