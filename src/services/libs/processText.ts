import { WordTokenizer } from "natural";
import { removeStopwords } from "stopword";

const tokenizer = new WordTokenizer();


function removeStopwordsFromText(text: string[]): string[] {
  if (text && text.length > 0) {
    try {
      const word: string[] = removeStopwords(text).length === 0 ? text : removeStopwords(text)
      return word;
    } catch (error) {
      console.error("Error removing stopwords:", error);
      return text; // Retourne le texte original en cas d'erreur
    }
  }
  return []; // Retourne un tableau vide si le texte est invalide
}

function tokenizeText(text: string): string[] {
  if (text && text.trim() !== "") {
    try {
      return tokenizer.tokenize(text);
    } catch (error) {
      console.error("Error tokenizing text:", error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  } else {
    console.warn("The text is empty or invalid");
    return []; // Retourne un tableau vide si le texte est vide
  }
}

export function processText(txt: string): string[] {
  const tokenizedWords = tokenizeText(txt.toLowerCase().normalize());
  const filteredWords = removeStopwordsFromText(tokenizedWords);

  return filteredWords;
}
