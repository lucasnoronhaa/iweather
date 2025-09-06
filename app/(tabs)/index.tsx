import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  return (
    <LinearGradient colors={['#2b3a67', '#61a0ff']} style={styles.box}>
      <View style={styles.box}>
        <Text style={styles.title}>iWeather - Mock Inicial</Text>
        <Text style={styles.subtitle}>Passo 2: UI mínima funcionando</Text>
      </View>
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});