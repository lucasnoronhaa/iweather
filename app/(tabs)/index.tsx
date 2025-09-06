import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";

const forcecastMock = [
  {id: '1', day: 'Seg', temp: '28º', },
  {id: '2', day: 'Ter', temp: '30º', },
  {id: '3', day: 'Qua', temp: '26º', },
  {id: '4', day: 'Qui', temp: '24º', },
];

export default function App() {
  return (
      <GestureHandlerRootView style={{flex: 1 }}>
    <LinearGradient colors={['#2b3a67', '#61a0ff']} style={styles.container}>
      {/*Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.city}>São Paulo</Text>
        <Text style={styles.date}>Segunda, 06 de Setembro</Text>
      </View>

      {/*Temperatura Principal */}
      <View style={styles.main}>
        <Text style={styles.temp}>28º</Text>
        <Text style={styles.condition}>Ensolarado</Text>
      </View>

      {/*Lista de previsão*/}
      <View style={styles.forecast}>
        <FlatList
        horizontal
        data={forcecastMock}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.tempSmall}>{item.temp}</Text>
      </View>
        )}
        />
      </View>

      <StatusBar style="light" />
    </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 40 },
  city: { color: "#fff", fontSize: 25, fontWeight: "700" },
  date: { color: "#fff", fontSize: 14, marginTop: 4 },
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  temp: { fontSize: 80, color: "#fff", fontWeight: "200" },
  condition: { fontSize: 20, color: "#eee" },
  forecast: { paddingBottom: 40 },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  day: { color: "#fff", fontSize: 16, fontWeight: "600" },
  tempSmall: { color: "#fff", fontSize: 14 },
});