import * as Localization from "expo-localization";
import cache from "../utility/cache";
import i18n from "i18n-js";

i18n.defaultSeparator = "=+=";

i18n.translations = {
  en: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "Drawer": "Drawer",
    "Settings": "Settings",
    "Puzzle": "Puzzle",
    "Similarity": "Similarity",
    "Guess": "Guess",
    "Distance": "Distance",
    "Enter your guesses here!": "Enter your guesses here!",
    "(enter word to continue)": "(enter word to continue)",
    "Get info on your guesses here!": "Get info on your guesses here!",
    "how alike your guess is to the secret word":
      "how alike your guess is to the secret word",
    "Similarity:": "Similarity:",
    "Distance:": "Distance:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "An indicator if your guess is in the top 1000 closest words to the secret",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "How similar the 1st, 10th, and 1000th closest words are to the secret",
    "enter your guess (click here)": "enter your guess",
    "(click here)": "(click here)",
    "1st": "1st",
    "10th": "10th",
    "1000th": "1000th",
    "GREAT!": "GREAT!",
    "Day Streak": "Day Streak",
    "Word found in": "Word found in",
    "guesses": "guesses",
    "Next puzzle In": "Next puzzle In",
    "You may continue exploring guesses without it affecting your score":
      "You may continue exploring guesses without it affecting your score.",
    "Share Win": "Share Win",
    "not found in our dictionary": "not found in our dictionary.",
    "far": "far",
    "Next word in": "Next word in",
    "YESTERDAY'S WORD": "YESTERDAY'S WORD",
    "Yesterday's 10 closest words": "Yesterday's 10 closest words",
    "(click for similar words)": "(click for similar words)",
    "SOLVED": "SOLVED",
    "AVG GUESSES": "AVG GUESSES",
    "🧪 STATS": "🧪 STATS",
    "Support Semantle": "Support Semantle",
    "Rate Semantle": "Rate Semantle",
    "Request Feature": "Request Feature",
    "Help": "Help",
    "Tutorial": "Tutorial",
    "Report Problem": "Report Problem",
    "Legacy Theme": "Legacy Theme",
    "Hide Yesterday's Word": "Hide Yesterday's Word",
    "I solved Semantle": "I solved Semantle",
    "in only one guess": "in only one guess!",
    "Download Semantle": "Download Semantle",
    "in": "in",
    "Statistics": "Statistics",
    "guesses My first guess had a similarity of":
      "guesses. My first guess had a similarity of",
    "My first guess in the top 1000 was at guess":
      "My first guess in the top 1000 was at guess",
    "My penultimate guess had a similarity of":
      "My penultimate guess had a similarity of",
    "Language:": "Language:",
    "FOUND": "FOUND",
    "Welcome to Semantle": "Welcome to Semantle",
    "The context-based word puzzle game": "The context-based word puzzle game.",
    "How to play": "How to play",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Enter a word and receive how similar it is to the daily word. Similarity is determined by context, not by spelling.",
    "Can you find the word": "Can you find the word?",
    "Play with the community": "Play with the community",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!",
  },
  es: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "Drawer": "Cajón",
    "Settings": "Ajustes",
    "Puzzle": "Rompecabezas",
    "Similarity": "Semejanza",
    "Guess": "Adivinar",
    "Distance": "Distancia",
    "enter your guess (click here)": "Ingrese su conjetura",
    "1st": "1º",
    "10th": "10º",
    "1000th": "1000º",
    "GREAT!": "¡Estupendo!",
    "Day Streak": "Racha de día",
    "Word found in": "Palabra encontrada en",
    "guesses": "suposiciones",
    "Next puzzle In": "Siguiente rompecabezas en",
    "You may continue exploring guesses without it affecting your score":
      "Puede continuar explorando las conjeturas sin que afecte su puntaje.",
    "Share Win": "Compartir ganar",
    "not found in our dictionary": "No encontrado en nuestro diccionario.",
    "far": "lejos",
    "Next word in": "Palabra siguiente en",
    "YESTERDAY'S WORD": "palabra de ayer",
    "(click for similar words)": "(Haga clic para palabras similares)",
    "SOLVED": "Resuelto",
    "AVG GUESSES": "µ ADIVINA",
    "🧪 STATS": "🧪 estadísticas",
    "Support Semantle": "Apoyar Semantle",
    "Rate Semantle": "Calificar Semantle",
    "Request Feature": "Característica de solicitud",
    "Help": "Ayudar",
    "Tutorial": "Tutorial",
    "Report Problem": "Reportar problema",
    "Legacy Theme": "Tema heredado",
    "Hide Yesterday's Word": "Ocultar la palabra de ayer",
    "I solved Semantle": "Resolví semantle",
    "in only one guess": "¡En solo una conjetura!",
    "Download Semantle": "Descargar Semantle",
    "in": "en",
    "guesses My first guess had a similarity of": "suposiciones.",
    "My first guess in the top 1000 was at guess":
      "Mi primera suposición en el Top 1000 estaba en Supongo",
    "My penultimate guess had a similarity of":
      "Mi penúltima suposición tuvo una similitud de",
    "Language:": "Idioma:",
    "FOUND": "ENCONTRADO",
    "Welcome to Semantle": "Bienvenido a Semantle",
    "The context-based word puzzle game":
      "El juego de rompecabezas de palabras basado en contexto.",
    "How to play": "Cómo jugar",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Ingrese una palabra y reciba lo similar que es para la palabra diaria.",
    "Can you find the word": "¿Puedes encontrar la palabra?",
    "Play with the community": "Jugar con la comunidad",
    "Enter your guesses here!": "¡Ingrese sus suposiciones aquí!",
    "(enter word to continue)": "(Ingrese la palabra para continuar)",
    "Get info on your guesses here!":
      "¡Obtenga información sobre sus conjeturas aquí!",
    "how alike your guess is to the secret word":
      "¿Qué tan parecido es tu suposición para la palabra secreta?",
    "Similarity:": "Semejanza:",
    "Distance:": "Distancia:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "Un indicador si su suposición está en las 1000 mejores palabras más cercanas al secreto",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "Cuán similares son las palabras 1, 10 y 1000 más cercanas al secreto",
    "(click here)": "(haga clic aquí)",
    "Yesterday's 10 closest words": "Las 10 palabras más cercanas de ayer",
    "Statistics": "Estadísticas",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Jugar Semantle con tus amigos es una gran experiencia.",
  },
  sv: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "Drawer": "Låda",
    "Settings": "inställningar",
    "Puzzle": "Pussel",
    "Similarity": "Likhet",
    "Guess": "Gissa",
    "Distance": "Distans",
    "enter your guess (click here)": "Ange ditt gissning",
    "1st": "1: a",
    "10th": "10: e",
    "1000th": "1000",
    "GREAT!": "BRA!",
    "Day Streak": "Dagsträva",
    "Word found in": "Ord som finns i",
    "guesses": "gissningar",
    "Next puzzle In": "Nästa pussel i",
    "You may continue exploring guesses without it affecting your score":
      "Du kan fortsätta att utforska gissningar utan att det påverkar din poäng.",
    "Share Win": "Dela WIN",
    "not found in our dictionary": "hittades inte i vår ordbok.",
    "far": "långt",
    "Next word in": "Nästa ord i",
    "YESTERDAY'S WORD": "Gårdagens ord",
    "(click for similar words)": "(klicka för liknande ord)",
    "SOLVED": "LÖST",
    "AVG GUESSES": "µ GISSNINGAR",
    "🧪 STATS": "🧪 Statistik",
    "Support Semantle": "Stöd Semantle",
    "Rate Semantle": "Ränta semantle",
    "Request Feature": "Begär funktion",
    "Help": "Hjälp",
    "Tutorial": "Handledning",
    "Report Problem": "Rapportera problem",
    "Legacy Theme": "Legacy tema",
    "Hide Yesterday's Word": "Göm gårdagens ord",
    "I solved Semantle": "Jag löste semanteln",
    "in only one guess": "i bara en gissning!",
    "Download Semantle": "Hämta Semantle",
    "in": "i",
    "guesses My first guess had a similarity of": "gissningar.",
    "My first guess in the top 1000 was at guess":
      "Min första gissning i topp 1000 var på Guess",
    "My penultimate guess had a similarity of":
      "Min näst sista gissning hade en likhet av",
    "Language:": "Språk:",
    "FOUND": "HITTADES",
    "Welcome to Semantle": "Välkommen till Semantle",
    "The context-based word puzzle game":
      "Det kontextbaserade ordet pusselspel.",
    "How to play": "Hur man spelar",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Ange ett ord och få hur lika det är till det dagliga ordet.",
    "Can you find the word": "Kan du hitta ordet?",
    "Play with the community": "Spela med samhället",
    "Enter your guesses here!": "Ange dina gissningar här!",
    "(enter word to continue)": "(Ange ord för att fortsätta)",
    "Get info on your guesses here!": "Få information om dina gissningar här!",
    "how alike your guess is to the secret word":
      "Hur lika din gissning är det hemliga ordet",
    "Similarity:": "Likhet:",
    "Distance:": "Distans:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "En indikator om din gissning är i de bästa 1000 närmaste orden till hemligheten",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "Hur lik den 1: a, 10: e och 1000: e närmaste orden är hemligheten",
    "(click here)": "(Klicka här)",
    "Yesterday's 10 closest words": "Gårdagens 10 närmaste ord",
    "Statistics": "Statistik",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Att spela Semantle med dina vänner är en fantastisk upplevelse.",
  },
  tr: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "Drawer": "Çekmece",
    "Settings": "Ayarlar",
    "Puzzle": "Bulmaca",
    "Similarity": "Benzerlik",
    "Guess": "Tahmin etmek",
    "Distance": "Mesafe",
    "enter your guess (click here)": "Tahmininizi girin",
    "1st": "1 inci",
    "10th": "10.",
    "1000th": "1000",
    "GREAT!": "İYİ!",
    "Day Streak": "Gündüz",
    "Word found in": "Kelime bulundu",
    "guesses": "tahmin etmek",
    "Next puzzle In": "Sonraki Bulma",
    "You may continue exploring guesses without it affecting your score":
      "Tahminleri puanınızı etkilemeden keşfetmeye devam edebilirsiniz.",
    "Share Win": "Paylaşmak",
    "not found in our dictionary": "Sözlüğümüzde bulunamadı.",
    "far": "uzak",
    "Next word in": "Bir sonraki kelime",
    "YESTERDAY'S WORD": "Dünün Sözü",
    "(click for similar words)": "(benzer kelimeler için tıklayın)",
    "SOLVED": "Çözüldü",
    "AVG GUESSES": "µ TAHMİNLER",
    "🧪 STATS": "🧪 istatistikler",
    "Support Semantle": "Semantel Destek",
    "Rate Semantle": "Hızı semtosu",
    "Request Feature": "İstek özelliği",
    "Help": "Yardım",
    "Tutorial": "Öğretici",
    "Report Problem": "Sorunu bildir",
    "Legacy Theme": "Miras teması",
    "Hide Yesterday's Word": "Dünün sözcüğünü gizle",
    "I solved Semantle": "İymantayı çözdüm",
    "in only one guess": "Sadece bir tahmin!",
    "Download Semantle": "İndir semantel",
    "in": "içinde",
    "guesses My first guess had a similarity of": "Tahmin eder.",
    "My first guess in the top 1000 was at guess":
      "İlk 1000'deki ilk tahminim tahmindeydi",
    "My penultimate guess had a similarity of":
      "Penültimate tahminim benzerliği vardı",
    "Language:": "Dilim:",
    "FOUND": "BULUNDU",
    "Welcome to Semantle": "Semantle'ye hoş geldiniz",
    "The context-based word puzzle game": "Bağlam tabanlı kelime puzzle oyunu.",
    "How to play": "Nasıl oynanır",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Bir kelime girin ve günlük kelimenin ne kadar benzer olduğunu alınız.",
    "Can you find the word": "Kelimeyi bulabilir misin?",
    "Enter your guesses here!": "Tahminlerinizi buraya girin!",
    "(enter word to continue)": "(devam etmek için kelimeyi girin)",
    "Get info on your guesses here!": "Tahminleriniz hakkında bilgi edinin!",
    "how alike your guess is to the secret word":
      "Tahmininiz gizli kelimeye ne kadar benziyor",
    "Similarity:": "Benzerlik:",
    "Distance:": "Mesafe:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "Tahmininiz sırrın en yakın 1000 kelimesinde ise bir gösterge",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "1., 10. ve 1000'inci en yakın kelimeler sırrına ne kadar benzer",
    "Play with the community": "Toplulukla Oynayın",
    "(click here)": "(buraya tıklayın)",
    "Yesterday's 10 closest words": "Dünün en yakın 10 kelimesi",
    "Statistics": "İstatistik",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Arkadaşlarınızla semantle oynamak harika bir deneyim.",
  },
  de: {
    "0": "0.",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4.",
    "5": "5.",
    "6": "6.",
    "7": "7.",
    "8": "8.",
    "9": "9.",
    "Drawer": "Schublade",
    "Settings": "Einstellungen",
    "Puzzle": "Puzzle",
    "Similarity": "Ähnlichkeit",
    "Guess": "Erraten",
    "Distance": "Distanz",
    "enter your guess (click here)": "Geben Sie Ihre Vermutung ein",
    "1st": "1",
    "10th": "10.",
    "1000th": "1000.",
    "GREAT!": "GROSSARTIG!",
    "Day Streak": "Tagesstreifen",
    "Word found in": "Wort in gefunden",
    "guesses": "Vermutungen",
    "Next puzzle In": "Nächstes Rätsel in.",
    "You may continue exploring guesses without it affecting your score":
      "Sie können Vermutungen weiter erkunden, ohne Ihre Punktzahl zu beeinflussen.",
    "Share Win": "Teilen Sie den Sieg",
    "not found in our dictionary": "nicht in unserem Wörterbuch gefunden.",
    "far": "weit",
    "Next word in": "Nächstes Wort in.",
    "YESTERDAY'S WORD": "Gesternes Wort",
    "(click for similar words)": "(Klicken Sie auf ähnliche Wörter)",
    "SOLVED": "Gelöst",
    "AVG GUESSES": "µ VERMUTUNGEN",
    "🧪 STATS": "🧪 Statistiken",
    "Support Semantle": "Support Semantle.",
    "Rate Semantle": "Rate Semantle.",
    "Request Feature": "Anforderungsfunktion",
    "Help": "Hilfe",
    "Tutorial": "Lernprogramm",
    "Report Problem": "Problem melden",
    "Legacy Theme": "Legacy -Thema",
    "Hide Yesterday's Word": "Verstecken Sie das Wort von gestern",
    "I solved Semantle": "Ich habe Semantle gelöst.",
    "in only one guess": "in nur einer raten!",
    "Download Semantle": "Semantel herunterladen",
    "in": "in",
    "guesses My first guess had a similarity of": "Vermutungen.",
    "My first guess in the top 1000 was at guess":
      "Meine erste Vermutung in der Top 1000 war erraten",
    "My penultimate guess had a similarity of":
      "Meine vorletzte Vermutung hatte eine Ähnlichkeit von",
    "Language:": "Sprache:",
    "FOUND": "GEFUNDEN",
    "Welcome to Semantle": "Willkommen in Semantle.",
    "The context-based word puzzle game":
      "Das kontextbasierte Wort-Puzzle-Spiel.",
    "How to play": "Spielanleitung",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Geben Sie ein Wort ein und empfangen Sie, wie ähnlich das tägliche Wort ist.",
    "Can you find the word": "Kannst du das Wort finden?",
    "Enter your guesses here!": "Geben Sie hier Ihre Vermutungen ein!",
    "(enter word to continue)": "(Geben Sie ein Wort ein, um fortzufahren)",
    "Get info on your guesses here!":
      "Holen Sie sich hier Informationen zu Ihren Vermutungen!",
    "how alike your guess is to the secret word":
      "Wie ähnlich Ihre Vermutung ist dem geheimen Wort",
    "Similarity:": "Ähnlichkeit:",
    "Distance:": "Distanz:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "Ein Indikator, wenn Ihre Vermutung in den Top 1000 am engsten Wörter des Geheimnisses ist",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "Wie ähnlich sind die engsten Worte der 1., 10. und 1000. Wörter zum Geheimnis",
    "Play with the community": "Spielen Sie mit der Community",
    "(click here)": "(Klicke hier)",
    "Yesterday's 10 closest words": "Die 10 engsten Worte von gestern",
    "Statistics": "Statistiken",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Semantle mit Ihren Freunden zu spielen ist eine großartige Erfahrung.",
  },
  nl: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "Drawer": "Lade",
    "Settings": "Instellingen",
    "Puzzle": "Puzzel",
    "Similarity": "Gelijkenis",
    "Guess": "Gok",
    "Distance": "Afstand",
    "enter your guess (click here)": "Voer je gok in",
    "1st": "1e",
    "10th": "10e",
    "1000th": "1000e",
    "GREAT!": "GROOT!",
    "Day Streak": "Dagstreep",
    "Word found in": "Woord gevonden in",
    "guesses": "gissingen",
    "Next puzzle In": "Volgende puzzel in",
    "You may continue exploring guesses without it affecting your score":
      "U kunt doorgaan met het verkennen van gissingen zonder dat het uw score beïnvloedt.",
    "Share Win": "Delen Win",
    "not found in our dictionary": "niet gevonden in ons woordenboek.",
    "far": "ver",
    "Next word in": "Volgend woord in",
    "YESTERDAY'S WORD": "Woord van gisteren",
    "(click for similar words)": "(Klik voor vergelijkbare woorden)",
    "SOLVED": "Opgelost",
    "AVG GUESSES": "µ GISSINGEN",
    "🧪 STATS": "🧪 statistieken",
    "Support Semantle": "Steun semantle",
    "Rate Semantle": "Tarief semantle",
    "Request Feature": "Aanvraagfunctie",
    "Help": "Helpen",
    "Tutorial": "Tutorial",
    "Report Problem": "Meld een probleem",
    "Legacy Theme": "Legacy Theme",
    "Hide Yesterday's Word": "Verberg het woord van gisteren",
    "I solved Semantle": "Ik heb semantel opgelost",
    "in only one guess": "in slechts één gok!",
    "Download Semantle": "Semantle downloaden",
    "in": "in",
    "guesses My first guess had a similarity of": "gissingen.",
    "My first guess in the top 1000 was at guess":
      "Mijn eerste gok in de top 1000 was op gok",
    "My penultimate guess had a similarity of":
      "Mijn voorlaatste gok had een gelijkenis van",
    "Language:": "Taal:",
    "FOUND": "GEVONDEN",
    "Welcome to Semantle": "Welkom bij Semantle",
    "The context-based word puzzle game":
      "Het op context gebaseerde woordpuzzelspel.",
    "How to play": "Hoe te spelen",
    "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling":
      "Voer een woord in en ontvang hoe vergelijkbaar het is met het dagelijkse woord.",
    "Can you find the word": "Kun je het woord vinden?",
    "Enter your guesses here!": "Voer hier uw gissingen in!",
    "(enter word to continue)": "(Voer Word in om door te gaan)",
    "Get info on your guesses here!":
      "Krijg hier informatie over je gissingen!",
    "how alike your guess is to the secret word":
      "Hoe hetzelfde is je gok aan het geheime woord",
    "Similarity:": "Gelijkenis:",
    "Distance:": "Afstand:",
    "An indicator if your guess is in the top 1000 closest words to the secret":
      "Een indicator als je gok in de top 1000 dichtstbijzijnde woorden staat bij het geheim",
    "How similar the 1st, 10th, and 1000th closest words are to the secret":
      "Hoe vergelijkbaar de 1e, 10e en 1000e dichtstbijzijnde woorden zijn met het geheim",
    "Play with the community": "Speel met de gemeenschap",
    "(click here)": "(Klik hier)",
    "Yesterday's 10 closest words":
      "De 10 dichtstbijzijnde woorden van gisteren",
    "Statistics": "Statistieken",
    "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!":
      "Semantle spelen met je vrienden is een geweldige ervaring.",
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
