import * as Localization from "expo-localization";
import cache from "../utility/cache";
import i18n from "i18n-js";
i18n.translations = {
  en: {
    "Semantle Pro": "Semantle Pro",
    Semantle: "Semantle",
    Drawer: "Drawer",
    Settings: "Settings",
    Puzzle: "Puzzle",
    Similarity: "Similarity",
    Guess: "Guess",
    Distance: "Distance",
    "enter your guess (click here)": "enter your guess (click here)",
    "1st": "1st",
    "10th": "10th",
    "1000th": "1000th",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "GREAT!": "GREAT!",
    "Day Streak": "Day Streak",
    "Word found in": "Word found in",
    guesses: "guesses",
    "Next puzzle In": "Next puzzle In",
    "You may continue exploring guesses without it affecting your score":
      "You may continue exploring guesses without it affecting your score.",
    "Share Win": "Share Win",
    "not found in our dictionary": "not found in our dictionary.",
    far: "far",
    Puzzle: "Puzzle",
    "Next word in": "Next word in",
    "YESTERDAY'S WORD": "YESTERDAY'S WORD",
    "(click for similar words)": "(click for similar words)",
    SOLVED: "SOLVED",
    "AVG GUESSES": "AVG GUESSES",
    "🧪 STATS": "🧪 STATS",
    "Support Semantle": "Support Semantle",
    "Rate Semantle": "Rate Semantle",
    "Request Feature": "Request Feature",
    Help: "Help",
    Tutorial: "Tutorial",
    "Report Problem": "Report Problem",
    "Legacy Theme": "Legacy Theme",
    "Hide Yesterday's Word": "Hide Yesterday's Word",
    "I solved Semantle": "I solved Semantle",
    "in only one guess": "in only one guess!",
    "Download Semantle": "Download Semantle",
    in: "in",
    "guesses My first guess had a similarity of":
      "guesses. My first guess had a similarity of",
    "My first guess in the top 1000 was at guess":
      "My first guess in the top 1000 was at guess",
    "My penultimate guess had a similarity of":
      "My penultimate guess had a similarity of",
  },
  sv: {
    "Semantle Pro": "Semantle Pro",
    Semantle: "Semantle",
    Drawer: "låda",
    Settings: "inställningar",
    Puzzle: "Puzzle",
    Similarity: "Likhet",
    Guess: "Gissa",
    Distance: "Avstånd",
    "enter your guess (click here)": "Ange din gissning (klicka här)",
    "1st": "1:a",
    "10th": "10:e",
    "1000th": "1000:e",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "GREAT!": "GREAT!",
    "Day Streak": "Dagstrakt",
    "Word found in": "Ordet hittades i",
    guesses: "gissningar",
    "Next puzzle In": "Nästa puzzle In",
    "You may continue exploring guesses without it affecting your score":
      "Du kan fortsätta att utforska gissningar utan att påverka ditt resultat.",
    "Share Win": "Dela vinst",
    "not found in our dictionary": "inte hittades i vår ordlista.",
    far: "långt",
    "Next word in": "Nästa ord i",
    "YESTERDAY'S WORD": "IGÅR'S ORD",
    "(click for similar words)": "(klicka för liknande ord)",
    SOLVED: "LÖST",
    "AVG GUESSES": "MEDELGISSNINGAR",
    "🧪 STATS": "🧪 STATISTIK",
    "Support Semantle": "Stöd Semantle",
    "Rate Semantle": "Betygsätt Semantle",
    "Request Feature": "Begär funktion",
    Help: "Hjälp",
    Tutorial: "Tutorial",
    "Report Problem": "Rapportera problem",
    "Legacy Theme": "Äldre tema",
    "Hide Yesterday's Word": "Dölj IGÅR'S ORD",
    "I solved Semantle": "Jag löste Semantle",
    "in only one guess": "i endast en gissning!",
    "Download Semantle": "Ladda ner Semantle",
    in: "i",
    "guesses My first guess had a similarity of":
      "gissningar. Min första gissning hade en likhet på",
    "My first guess in the top 1000 was at guess":
      "Min första gissning i topp 1000 var på gissning",
    "My penultimate guess had a similarity of":
      "Min förra gissning hade en likhet på",
  },
  es: {
    "Semantle Pro": "Semantle Pro",
    Semantle: "Semantle",
    Drawer: "cajón",
    Settings: "ajustes",
    Puzzle: "Rompecabezas",
    Similarity: "Similaridad",
    Guess: "Adivinar",
    Distance: "Distancia",
    "enter your guess (click here)":
      "introduzca su adivinación (haga clic aquí)",
    "1st": "1º",
    "10th": "10º",
    "1000th": "1000º",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "GREAT!": "¡MUY BIEN!",
    "Day Streak": "Estrellas del día",
    "Word found in": "Palabra encontrada en",
    guesses: "intentos",
    "Next puzzle In": "Próximo rompecabezas en",
    "You may continue exploring guesses without it affecting your score":
      "Puede continuar explorando gafas sin que afecte su puntuación",
    "Share Win": "Compartir ganar",
    "not found in our dictionary": "no se encuentra en nuestro diccionario.",
    far: "lejos",
    "Next word in": "Próximo orden en",
    "YESTERDAY'S WORD": "ORDEN DE AYER",
    "(click for similar words)": "(haga clic para palabras similares)",
    SOLVED: "RESUELTO",
    "AVG GUESSES": "MEDIA DE INTENTOS",
    "🧪 STATS": "🧪 ESTADÍSTICAS",
    "Support Semantle": "Apoyo Semantle",
    "Rate Semantle": "Valorar Semantle",
    "Request Feature": "Solicitar función",
    Help: "Ayuda",
    Tutorial: "Tutorial",
    "Report Problem": "Informar problema",
    "Legacy Theme": "Tema heredado",
    "Hide Yesterday's Word": "Ocultar ORDEN DE AYER",
    "I solved Semantle": "He resuelto Semantle",
    "in only one guess": "en solo un intento!",
    "Download Semantle": "Descargar Semantle",
    in: "en",
    "guesses My first guess had a similarity of":
      "intentos. Mi primer intento tenía una similitud de",
    "My first guess in the top 1000 was at guess":
      "Mi primer intento en la top 1000 fue en el intento",
    "My penultimate guess had a similarity of":
      "Mi último intento tenía una similitud de",
  },
  nl: {
    "Semantle Pro": "Semantle Pro",
    Semantle: "Semantle",
    Drawer: "lade",
    Settings: "instellingen",
    Puzzle: "Puzzel",
    Similarity: "Gelijkenis",
    Guess: "Gok",
    Distance: "Afstand",
    "enter your guess (click here)": "voer uw vermoeding in (klik hier)",
    "1st": "1e",
    "10th": "10e",
    "1000th": "1000e",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "GREAT!": "GEWEELD!",
    "Day Streak": "Dagstrek",
    "Word found in": "Woord gevonden in",
    guesses: "gokken",
    "Next puzzle In": "Volgende puzzel In",

    "You may continue exploring guesses without it affecting your score":
      "U kunt verder met het onderzoeken van gafas zonder dat het uw score beïnvloedt",
    "Share Win": "Delen Win",

    "not found in our dictionary": "niet gevonden in ons woordenboek.",
    far: "ver weg",

    "Next word in": "Volgende woord in",
    "YESTERDAY'S WORD": "VORIGE WOORD",
    "(click for similar words)": "(klik voor vergelijkbare woorden)",
    SOLVED: "OPGELEVERD",
    "AVG GUESSES": "GEM. GOKKEN",
    "🧪 STATS": "🧪 STATISTIEKEN",
    "Support Semantle": "Ondersteun Semantle",
    "Rate Semantle": "Beoordeel Semantle",
    "Request Feature": "Vraag functie aan",
    Help: "Help",
    Tutorial: "Tutorial",
    "Report Problem": "Probleem rapporteren",
    "Legacy Theme": "Verouderde thema",
    "Hide Yesterday's Word": "Verberg VORIGE WOORD",
    "I solved Semantle": "Ik heb Semantle opgelost",
    "in only one guess": "in slechts één gok",
    "Download Semantle": "Download Semantle",
    in: "in",
    "guesses My first guess had a similarity of":
      "gokken. Mijn eerste gok had een overeenkomst van",
    "My first guess in the top 1000 was at guess":
      "Mijn eerste gok in de top 1000 was op de gok",
    "My penultimate guess had a similarity of":
      "Mijn vorige gok had een overeenkomst van",
  },
  tr: {
    "Semantle Pro": "Semantle Pro",
    Semantle: "Semantle",
    Drawer: "çekmece",
    Settings: "ayarlar",
    Puzzle: "Puzzle",
    Similarity: "Benzerlik",
    Guess: "Tahmin",
    Distance: "Mesafe",
    "enter your guess (click here)": "tahmininizi girin (buraya tıklayın)",
    "1st": "1. sırada",
    "10th": "10. sırada",
    "1000th": "1000. sırada",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "GREAT!": "İYİ!",
    "Day Streak": "Gün Streak",
    "Word found in": "Kelime bulunduğu",
    guesses: "tahmin",
    "Next puzzle In": "Sonraki puzzle In",
    "You may continue exploring guesses without it affecting your score":
      "Puanınızı etkilemez bir şekilde gözden geçirmek için gafelerinizi daha fazla keşfetmenizi sağlayabilirsiniz",
    "Share Win": "Kazanını Paylaş",
    "not found in our dictionary": "sözlükte bulunamadı.",
    far: "uzak",
    "Next word in": "Sonraki kelime in",
    "YESTERDAY'S WORD": "DÖNEN GÜN",
    "(click for similar words)": "(benzer kelimeler için tıklayın)",
    SOLVED: "ÇÖZÜLDÜ",
    "AVG GUESSES": "ORTALAMA TAHMIN",
    "🧪 STATS": "🧪 İSTATİSTİKLER",
    "Support Semantle": "Semantle'i Destekle",
    "Rate Semantle": "Semantle'i Değerlendir",
    "Request Feature": "Özellik İste",
    Help: "Yardım",
    Tutorial: "Eğitim",
    "Report Problem": "Sorun Bildir",
    "Legacy Theme": "Eski Tema",
    "Hide Yesterday's Word": "DÖNEN GÜNÜ GİZLE",
    "I solved Semantle": "Semantle'i Çözdüm",
    "in only one guess": "sadece bir tahmin ile",
    "Download Semantle": "Semantle'i İndir",
    in: "in",
    "guesses My first guess had a similarity of":
      "tahmin. Mevcut tahminin benzerliği",
    "My first guess in the top 1000 was at guess":
      "Mevcut tahminin 1000. sırada olduğu tahmin",
    "My penultimate guess had a similarity of":
      "Mevcut tahminin önceki tahmininin benzerliği",
  },
};
async function checkAndSetLocalization() {
  const language = await cache.getData("SEMANTLE::LANGUAGE", false);
  if (language) {
    i18n.locale = language;
  } else {
    i18n.locale = Localization.locale.split("-")[0];
  }
}
checkAndSetLocalization();
