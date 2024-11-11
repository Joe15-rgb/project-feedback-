import { PorterStemmer, SentimentAnalyzer } from "natural";
import { processText } from "./libs/processText";
import type { SentimentType } from "../database/Atrributs/SentimentAttributs";
import { Message, Sentiment } from "./types";

const Analyzer = SentimentAnalyzer;
const stemmer = PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");


function AnalyzerSentiment(msgs: string[] | object[], sentimentSet: Set<Sentiment>): Set<Sentiment> {
  // Vérifie si msgs est un tableau d'objets
  const isObjectArray = Array.isArray(msgs) && msgs.every(msg => typeof msg === 'object' && msg !== null);

  msgs.forEach((msg: Message | string) => {
    let message: string | undefined;

    if (typeof msg === 'string') {
      // Si msg est une chaîne, on l'utilise directement
      message = msg.trim();
    } else if (isObjectArray) {
      // Si msg est un objet, on vérifie les propriétés acceptées
      message = msg.input || msg.message || msg.content || msg.msg;

      // Vérifie que message n'est pas null ou vide
      if (!message || message.trim() === "") {
        throw new Error("Chaque objet doit contenir l'une des propriétés suivantes : input, message, content, msg avec une valeur non vide.");
      }
    }

    if (message && message.trim() !== "") { // Vérifie que message n'est pas null ou vide
      const words = processText(message) as string[]; // Traite le message pour obtenir les mots
      console.log("🚀 ~ msgs.forEach ~ words:", words)
      const score = analyzer.getSentiment(words);

      // Crée une instance de Sentiment et l'ajoute au set
      const sentiment = new Sentiment({
        input: message,
        output: score > 0 ? "positif" : score === 0 || score === null ? "neutre" : "negatif", // Exemples d'output basés sur le score
        score,
      });

      //stock in database


      sentimentSet.add(sentiment);
    }
  });

  return sentimentSet;
}



export default AnalyzerSentiment