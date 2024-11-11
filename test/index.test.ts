const natural = require("natural");

const emojis = ['😊', '😂', '❤️', '😢', '😎']; // Liste des emojis
const emojiToIndex = emojis.reduce((acc, emoji, index) => {
  acc[emoji] = index; // Crée un mapping emoji -> index
  return acc;
}, {});

function oneHotEncode(emoji) {
  const oneHot = Array(emojis.length).fill(0); // Crée un tableau de zéros
  if (emojiToIndex[emoji] !== undefined) {
    oneHot[emojiToIndex[emoji]] = 1; // Mettez 1 à l'index correspondant
  }
  return oneHot;
}

// Exemple d'utilisation
const encodedEmoji = oneHotEncode('😊');
const encodedEmoji2 = oneHotEncode('😢');
console.log(encodedEmoji); // [1, 0, 0, 0, 0]
console.log(encodedEmoji2); // [0, 0, 0, 1, 0]

const classifier = new natural.BayesClassifier();

// Ajoutez des échantillons avec leur étiquette
classifier.addDocument(oneHotEncode('😊'), 'positive');
classifier.addDocument(oneHotEncode('😢'), 'negative');
// Ajoutez d'autres documents ici

classifier.train();

// Prédiction
const result = classifier.classify(oneHotEncode('😢'));
console.log("🚀 ~ result:", result)
