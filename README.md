Esercizio — App Diario di Viaggio
Crea un'app con 2 tab:
Tab Registra (index.tsx)

Un bottone "Dove sono?" che recupera le coordinate attuali e le mostra in una card (latitudine, longitudine, città tramite reverse geocoding)
Un bottone "Scatta foto" che apre la camera e scatta una foto
Un bottone "Salva tappa" che salva in AsyncStorage un oggetto con coordinate, foto (uri) e data/ora attuale
Mostra un feedback visivo dopo il salvataggio — tipo un testo "Tappa salvata!" che appare per 2 secondi

Tab Tappe (tappe.tsx)

Al montaggio legge tutte le tappe salvate in AsyncStorage
Le mostra in una FlatList — ogni card mostra la foto, la città, le coordinate e la data/ora
Un bottone "Elimina" su ogni card che rimuove quella tappa da AsyncStorage e aggiorna la lista
Se non ci sono tappe mostra "Nessuna tappa salvata ancora"

Concetti che eserciti: expo-location, expo-camera, AsyncStorage, fetch (reverse geocoding), FlatList, permessi, stato condizionale.
