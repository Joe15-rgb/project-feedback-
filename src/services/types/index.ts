import { SentimentType } from "../../database/Atrributs/SentimentAttributs";

export interface Message {
  input?: string;
  message?: string;
  content?: string;
  msg?: string;
}
export class Sentiment {
  input: string;
  output: string;
  score: number;

  constructor(data: SentimentType) {
    this.input = data.input;
    this.output = data.output;
    this.score = data.score;
  }
}
