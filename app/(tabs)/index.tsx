import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//Dados mockados

const forcecastMock = [
  {id: '1', day: 'Seg', temp: '28º', },
  {id: '2', day: 'Ter', temp: '30º', },
  {id: '3', day: 'Qua', temp: '26º', },
  {id: '4', day: 'Qui', temp: '24º', },
];

const forecast = [
  { day: 'Seg', temp: 28, icon: 'sunny' },
  { day: 'Ter', temp: 30, icon: 'partly-sunny' },
  { day: 'Qua', temp: 26, icon: 'cloudy' },
  { day: 'Qui', temp: 24, icon: 'rainy' },
  { day: 'Sex', temp: 27, icon: 'sunny' },
  { day: 'Sáb', temp: 29, icon: 'partly-sunny' },
  { day: 'Dom', temp: 25, icon: 'cloudy' },
]

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
        <Ionicons name="sunny" size={80} color="yellow" />
      </View>

      {/*Previsão do Tempo - Cards*/}
      <View style={styles.forecastContainer}>
        {forecast.map((item, index) => (
          <View key={index} style={styles.card}>
            <Ionicons name={item.icon} size={30} color="white" />
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.tempSmall}>{item.temp}º</Text>
          </View>
          ))}
      </View>

      {/*Status Bar */}

      <StatusBar style="light" />
    </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: 50
  },
  header: { 
    alignItems: "center",
    marginBottom: 40
  },
  city: { color: "#fff",
    fontSize: 25,
    fontWeight: "700"
  },
  date: { color: "#fff",
    fontSize: 14,
    marginTop: 4
  },
  main: { flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  temp: { 
    fontSize: 80,
    color: "#fff",
    fontWeight: "200",
    justifyContent: "center",
    marginTop: 20
  },
  condition: { fontSize: 20,
    color: "#eee",
    justifyContent: "center"
  },
  forecast: { 
    paddingBottom: 40
  },
  day: { 
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  tempSmall: { color: "#fff", fontSize: 14 },
  forecastContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40 
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: 70,
  },
  
});