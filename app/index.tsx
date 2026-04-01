import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import { Text, View } from "react-native";

type Tappa = {
  id: string;
  latitudine: number;
  longitudine: number;
  citta: string;
  fotoUri: string;
  dataOra: string;
};

export default function Index() {
  const [permessoCamera, richiestaPermessoCamera] = useCameraPermissions();

  const [foto, setFoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permessoCamera) return <View />;

  //--------------------

  const [permessoPosizione, richiediPermessoPosizione] =
    Location.useForegroundPermissions();

  return (
    <View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
