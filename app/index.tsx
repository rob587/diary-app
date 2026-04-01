import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
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

export default function Index() {
  const [permessoCamera, richiestaCamera] = useCameraPermissions();
  const [permessoPosizione, richiestaPosizione] =
    Location.useForegroundPermissions();

  const [foto, setFoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const [posizione, setPosizione] = useState<Location.LocationObject | null>(
    null,
  );
  const [citta, setCitta] = useState<string>("");
  const [caricamento, setCaricamento] = useState(false);

  const [messaggioFeedback, setMessaggioFeedback] = useState<string>("");

  // === MODALE (quale schermata mostrare) ===
  const [modalita, setModalita] = useState<
    "principale" | "camera" | "visualizza"
  >("principale");

  // === BOTTONE "DOVE SONO?" ===
  const ottieniPosizione = async () => {
    if (!permessoPosizione?.granted) {
      await richiestaPosizione();
      return;
    }

    try {
      setCaricamento(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setPosizione(location);

      // Reverse geocoding per ottenere la città
      const [indirizzi] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (indirizzi) {
        setCitta(indirizzi.city || indirizzi.region || "Sconosciuto");
      }
    } catch (errore) {
      console.error("Errore nella geolocalizzazione:", errore);
    } finally {
      setCaricamento(false);
    }
  };

  // === BOTTONE "SALVA TAPPA" ===
  const salvaTappa = async () => {
    if (!posizione || !foto) return;

    try {
      setCaricamento(true);

      // Crea l'oggetto tappa
      const nuovaTappa: Tappa = {
        id: Date.now().toString(),
        latitudine: posizione.coords.latitude,
        longitudine: posizione.coords.longitude,
        citta,
        fotoUri: foto,
        dataOra: new Date().toLocaleString("it-IT"),
      };

      // Leggi le tappe esistenti
      const tappeEsistenti = await AsyncStorage.getItem("tappe");
      const tappe = tappeEsistenti ? JSON.parse(tappeEsistenti) : [];

      // Aggiungi la nuova tappa
      tappe.push(nuovaTappa);

      // Salva in AsyncStorage
      await AsyncStorage.setItem("tappe", JSON.stringify(tappe));

      // Mostra feedback
      setMessaggioFeedback("✅ Tappa salvata!");
      setTimeout(() => setMessaggioFeedback(""), 2000);

      // Reset stato
      setFoto(null);
      setPosizione(null);
      setCitta("");
    } catch (errore) {
      console.error("Errore nel salvataggio:", errore);
      setMessaggioFeedback("❌ Errore nel salvataggio");
      setTimeout(() => setMessaggioFeedback(""), 2000);
    } finally {
      setCaricamento(false);
    }
  };

  if (!permessoCamera) return <View />;

  if (!permessoCamera.granted) {
    return (
      <View style={styles.centro}>
        <Text style={styles.testo}>Serve il permesso della camera</Text>
        <Pressable style={styles.btn} onPress={richiestaCamera}>
          <Text style={styles.btnTesto}>Dai il permesso</Text>
        </Pressable>
      </View>
    );
  }

  if (modalita === "principale") {
    return (
      <View style={styles.principale}>
        <ScrollView contentContainerStyle={styles.scrollContenutoPrincipale}>
          {/* Info posizione se disponibile */}
          {posizione && (
            <View style={styles.card}>
              <Text style={styles.titolo}>📍 Posizione attuale</Text>
              <Text style={styles.info}>
                Lat: {posizione.coords.latitude.toFixed(4)}
              </Text>
              <Text style={styles.info}>
                Lon: {posizione.coords.longitude.toFixed(4)}
              </Text>
              {citta && <Text style={styles.info}>🏙️ {citta}</Text>}
            </View>
          )}

          {/* Foto se disponibile */}
          {foto && <Image source={{ uri: foto }} style={styles.fotoPreview} />}
        </ScrollView>

        {/* Bottoni a fondo */}
        <View style={styles.barre}>
          <Pressable style={styles.btn} onPress={ottieniPosizione}>
            <Text style={styles.btnTesto}>📍 Dove sono?</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => setModalita("camera")}>
            <Text style={styles.btnTesto}>📸 Scatta foto</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, !posizione || !foto ? { opacity: 0.5 } : {}]}
            disabled={!posizione || !foto}
            onPress={salvaTappa}
          >
            <Text style={styles.btnTesto}>💾 Salva tappa</Text>
          </Pressable>
        </View>

        {/* Feedback */}
        {messaggioFeedback && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTesto}>{messaggioFeedback}</Text>
          </View>
        )}
      </View>
    );
  }

  if (modalita === "camera") {
    const scattaFoto = async () => {
      if (!cameraRef.current) return;
      const risultato = await cameraRef.current.takePictureAsync();
      if (risultato) setFoto(risultato.uri);
    };

    if (foto) {
      return (
        <View style={styles.contenitore}>
          <Image source={{ uri: foto }} style={styles.foto} />
          <View style={styles.bottoniCamera}>
            <Pressable style={styles.btn} onPress={() => setFoto(null)}>
              <Text style={styles.btnTesto}>Scatta un'altra</Text>
            </Pressable>
            <Pressable
              style={styles.btn}
              onPress={() => setModalita("principale")}
            >
              <Text style={styles.btnTesto}>Confermato</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contenitore}>
        <CameraView style={styles.camera} ref={cameraRef} />
        <Pressable style={styles.btnScatta} onPress={scattaFoto}>
          <View style={styles.cerchio} />
        </Pressable>
      </View>
    );
  }

  return <View />;

  //--------------------
}
const styles = StyleSheet.create({
  principale: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContenutoPrincipale: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    gap: 8,
  },
  titolo: { fontSize: 16, fontWeight: "700" },
  info: { fontSize: 14, color: "#666" },
  fotoPreview: { height: 200, borderRadius: 12 },
  barre: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  contenitore: { flex: 1 },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  camera: { flex: 1 },
  foto: { flex: 1 },
  testo: { fontSize: 16, textAlign: "center", paddingHorizontal: 24 },
  btn: { backgroundColor: "#4f46e5", padding: 16, borderRadius: 12 },
  btnTesto: { color: "#fff", fontWeight: "600", textAlign: "center" },
  btnScatta: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cerchio: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  bottoniCamera: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    gap: 12,
    flexDirection: "row",
  },
  feedback: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  feedbackTesto: { color: "#fff", fontWeight: "600" },
});
