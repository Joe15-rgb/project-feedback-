import { SentimentType } from "../database/Atrributs/SentimentAttributs";
import { processText } from "./libs/processText";
import * as fs from 'node:fs/promises';
import { resolve } from "node:path";
import natural from "natural";
import { Message, Sentiment } from "./types";

const classifier = new natural.BayesClassifier();

async function logFile(): Promise<string> {
  const filePath = resolve('H:/Projets/TypeScript/feelback-ai/src/database/datasets/datasets.json');

  try {
    const contents = await fs.readFile(filePath, { encoding: 'utf8' });
    return contents;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err; // Re-throwing the error for better error handling
  }
}

(async () => {
  try {
    const fileContents = await logFile();
    const datasets: SentimentType[] = JSON.parse(fileContents);

    // Adding documents to the classifier
    datasets.forEach(data => {
      const txt: string[] = processText(data.input) as string[];
      classifier.addDocument(txt, data.output);
    });

    classifier.train();

    // Saving the classifier with error handling
    classifier.save('classifier.json', (err) => {
      if (err) {
        console.error('Error saving classifier:', err);
      } else {
        console.log('Classifier saved to classifier.json');
      }
    });
  } catch (e) {
    console.error('Error in main execution:', e);
  }
})();

function ModelClassifier(message: string): { input: string; output: string; score: any } | null {
  try {
    const processedMessage = processText(message) as string[];
    const classification = classifier.classify(processedMessage);
    const score = classifier.getClassifications(processedMessage);

    return {
      input: message,
      output: classification,
      score: score,
    };
  } catch (e) {
    console.error('Error classifying message:', e);
    return null; // Returning null on error for better handling
  }
}

function ModelClassifierMessages(msgs: string[] | object[], sentimentSet: Set<Sentiment>): Set<Sentiment> {
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
      const sentiment = ModelClassifier(message) as SentimentType

      sentimentSet.add(sentiment);
    }
  });

  return sentimentSet;
}

export default ModelClassifierMessages;
