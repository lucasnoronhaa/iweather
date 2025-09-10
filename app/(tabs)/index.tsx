import { useState } from "react";
import { Text, StyleSheet, View, TextInput, FlatList, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const cities = [
    "São Paulo, BR",
    "Rio de Janeiro, BR",
    "Porto Alegre, BR",
    "Porto, Portugal",
    "Lisboa, Portugal",
  ];

  function handleSearch(text: string) {
    setSearch(text);
    if (text.length > 1) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>☁️ iWeather</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Boas vindas ao <Text style={styles.highlight}>TypeWeather</Text>
        </Text>
        <Text style={styles.subtitle}>
          Escolha um local para ver a previsão do tempo
        </Text>

        {/* Campo de busca */}
        <TextInput
          placeholder="Buscar local"
          placeholderTextColor="#555"
          style={styles.input}
          value={search}
          onChangeText={handleSearch}
        />

        {/* Lista de sugestões */}
        <FlatList
          style={styles.suggestionList}
          data={results}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestion}
              onPress={() => {
                setSearch(item);
                setResults([]);
              }}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 200,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  highlight: {
    color: "#4f8ef7",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#1c1c24",
    padding: 14,
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  suggestionList: {
    width: "100%", // faz a lista ter o mesmo tamanho do input
  },
  suggestion: {
    backgroundColor: "#1c1c24",
    padding: 14,
    borderRadius: 8,
    marginVertical: 4,
  },
  suggestionText: {
    color: "#fff",
    fontSize: 16,
  },
});
