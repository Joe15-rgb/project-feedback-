import fs from "node:fs"
import { SentimentType } from '../database/Atrributs/SentimentAttributs';
/**
 *
 * @param {String} messages
 * @returns String[]
 */
export function parserMessages(messages: string) {
  const bestMessage: string[] = [];

  if (messages != "" && typeof messages != "number") {
    const arrmsgs = messages.split(/();/);

    arrmsgs.filter((w) => {
      if (w !== "") {
        const bestWord = w
          .replace("\n", "")
          .replace('"', "")
          .replace('"', "")
          .replace("\n", "")
          .replace("\r", "");

        if (bestWord !== "") {
          bestMessage.push(bestWord);
        }
      }
    });
  } else {
    throw console.log("Aucun messages n'a était passé");
  }

  return bestMessage;
}

export function writeFileData(data: object) {
  const dataJSON = JSON.stringify(data);

  const path: string = `./data/data-${Date.now()}.json`;

  fs.writeFileSync(path, dataJSON);
}

export function groupSentiment(data: SentimentType[]) {

  const counteSentiments = data.reduce((allSentiments, sentiment) => {
    const currSentiment = allSentiments[sentiment.output as string] ?? 0;
    allSentiments[sentiment.output as string] = currSentiment + 1;

    return allSentiments;
  }, Object.create(null));

  return counteSentiments;
}
export function percentageCalc(m: number, n: number) {
  const percentage = Math.floor(m / n * 100)
  return percentage
}