import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Tappa = {
  id: string;
  latitudine: number;
  longitudine: number;
  citta: string;
  fotoUri: string;
  dataOra: string;
};

export default function Tappe() {
  const [tappe, setTappe] = useState<Tappa[]>([]);
  const [caricamento, setCaricaricamento] = useState(true);

  // Carica le tappe da AsyncStorage al montaggio
  useEffect(() => {
    caricaTappe();
  }, []);

  const caricaTappe = async () => {
    try {
      setCaricaricamento(true);
      const tappeJson = await AsyncStorage.getItem("tappe");
      if (tappeJson) {
        const tappeParsate = JSON.parse(tappeJson);
        setTappe(tappeParsate);
      } else {
        setTappe([]);
      }
    } catch (errore) {
      console.error("Errore nel caricamento delle tappe:", errore);
    } finally {
      setCaricaricamento(false);
    }
  };

  const eliminaTappa = async (id: string) => {
    Alert.alert(
      "Elimina tappa",
      "Sei sicuro di voler eliminare questa tappa?",
      [
        { text: "Annulla", onPress: () => {}, style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            try {
              const tape = tappe.filter((t) => t.id !== id);
              await AsyncStorage.setItem("tappe", JSON.stringify(tape));
              setTappe(tape);
            } catch (errore) {
              console.error("Errore nell'eliminazione:", errore);
            }
          },
        },
      ],
    );
  };

  if (caricamento) {
    return (
      <View style={styles.centro}>
        <Text style={styles.testo}>Caricamento...</Text>
      </View>
    );
  }

  if (tappe.length === 0) {
    return (
      <View style={styles.centro}>
        <Text style={styles.testoVuoto}>📝 Nessuna tappa salvata ancora</Text>
        <Pressable style={styles.btn} onPress={caricaTappe}>
          <Text style={styles.btnTesto}>Ricarica</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.contenitore}>
      <FlatList
        data={tappe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContenutoPrincipale}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Foto */}
            <Image source={{ uri: item.fotoUri }} style={styles.foto} />

            {/* Città */}
            <Text style={styles.citta}>🏙️ {item.citta}</Text>

            {/* Coordinate */}
            <Text style={styles.coordinate}>
              📍 {item.latitudine.toFixed(4)}, {item.longitudine.toFixed(4)}
            </Text>

            {/* Data */}
            <Text style={styles.dataOra}>📅 {item.dataOra}</Text>

            {/* Bottone Elimina */}
            <Pressable
              style={styles.btnElimina}
              onPress={() => eliminaTappa(item.id)}
            >
              <Text style={styles.btnEliminaTesto}>🗑️ Elimina</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: "#f9fafb" },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  testoVuoto: { fontSize: 18, fontWeight: "600", color: "#666" },
  testo: { fontSize: 16, color: "#999" },
  listContenutoPrincipale: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  foto: {
    width: "100%",
    height: 180,
  },
  citta: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  coordinate: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  dataOra: {
    fontSize: 14,
    color: "#999",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  btn: { backgroundColor: "#4f46e5", padding: 12, borderRadius: 8 },
  btnTesto: { color: "#fff", fontWeight: "600", textAlign: "center" },
  btnElimina: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnEliminaTesto: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
