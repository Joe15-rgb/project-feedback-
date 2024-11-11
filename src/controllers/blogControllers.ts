import { Request, Response } from "express";
import { parserMessages } from "../utils";
import AnalyzerSentiment from "../services/analyzer";
import { SentimentType } from '../database/Atrributs/SentimentAttributs';
import { groupSentiment } from '../utils/parser';
import ModelClassifierMessages from "../services/model";

class Blogs {
  static async index(req: Request, res: Response) {
    try {
      return res.status(200).render("index");
    } catch (error) {
      console.error("Error rendering index:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  static async traitement(req: Request, res: Response) {
    try {
      const { messages } = req.body;

      // Validation des données d'entrée
      if (!messages) {
        return res.status(400).send("Bad Request: 'messages' is required.");
      }

      const sentimentSet = new Set<SentimentType>();
      const classSet = new Set<SentimentType>();
      const parsedMessages = Blogs.checkData(messages);

      // Vérification si les messages ont été correctement analysés
      if (parsedMessages) {
        // Appel à AnalyzerSentiment pour traiter les messages
        AnalyzerSentiment(parsedMessages as string[], sentimentSet);
      }

      const sentiments = Array.from(sentimentSet);
      const statSentiments = groupSentiment(sentiments);
      const classifySentiments = ModelClassifierMessages(sentiments, classSet);
      const classify = Array.from(classifySentiments);

      // Envoi des résultats au client
      return res.status(201).json({ sentiments, statSentiments, classify });
    } catch (error) {
      console.error("Error in traitement:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  // Vérification et traitement des données d'entrée
  static checkData(data: string) {
    return Blogs.isValidJson(data) ? JSON.parse(data) : parserMessages(data);
  }

  // Vérification de la validité d'une chaîne JSON
  static isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}

export default Blogs;
