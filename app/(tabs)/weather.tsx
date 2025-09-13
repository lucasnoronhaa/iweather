import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function WeatherScreen() {
    const {city} = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Previsão para:</Text>
            <Text style={styles.city}>{city}</Text>
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
    title: {
        fontSize: 20,
        color: "#fff"
    },
    city: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4f8ef7",
        marginTop: 10,
    }
});