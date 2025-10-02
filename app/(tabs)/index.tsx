import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { searchCities } from "../../scripts/weatherApi"; // Importa nossa nova função

// Interface para definir o formato de cada cidade retornada pela API
interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function index() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para o "carregando..."
  const router = useRouter();

  // EFEITO PARA BUSCAR NA API COM DEBOUNCE
  useEffect(() => {
    if (search.trim().length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      const citiesFound = await searchCities(search);
      console.log("CIDADES ENCONTRADAS PELA API:", citiesFound);
      setResults(citiesFound);
      setIsLoading(false);
    }, 500); // Espera 500ms após o usuário parar de digitar

    return () => clearTimeout(delayDebounceFn); // Limpa o timeout se o usuário digitar novamente
  }, [search]); // Roda este efeito sempre que o 'search' mudar

  // Função para formatar o nome da cidade para exibição
  const formatCityName = (item: City) => {
    let name = `${item.name}, ${item.country}`;
    if (item.state) {
      name = `${item.name}, ${item.state}, ${item.country}`;
    }
    return name;
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>☁️ iWeather</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Boas vindas ao <Text style={styles.highlight}>iWeather</Text>
        </Text>
        <Text style={styles.subtitle}>
          Escolha um local para ver a previsão do tempo
        </Text>

        {/* Campo de busca */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Buscar local"
            placeholderTextColor="#555"
            style={styles.input}
            value={search}
            onChangeText={setSearch} // Agora só atualiza o estado
          />
          {isLoading && <ActivityIndicator size="small" color="#fff" />}
        </View>

        {/* Lista de sugestões */}
        <FlatList
          style={styles.suggestionList}
          data={results}
          keyExtractor={(item) => `${item.lat}-${item.lon}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                // Formata o nome para exibir no campo de busca
                const cityName = formatCityName(item);
                setSearch(cityName);
                // Limpa os resultados para a lista desaparecer
                setResults([]);
                // Navega para a tela de clima passando lat e lon
                router.push({
                  pathname: "/weather",
                  params: { lat: item.lat, lon: item.lon, city: cityName },
                });
              }}
            >
              <Text style={styles.suggestionText}>{formatCityName(item)}</Text>
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
  suggestionList: {
    width: "100%",
    marginTop: 10,
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
  inputContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1c1c24",
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    width: "100%",
    backgroundColor: "#1c1c24",
    borderRadius: 8,
    marginBottom: 10
  },
});