import { DataTypes, Model, Sequelize } from "sequelize";
import { SentimentType } from "../Atrributs/SentimentAttributs";


export class Sentiments extends Model implements SentimentType {
  declare id: number;
  declare input: string;
  declare output: string;
  declare score: number;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;


  static initModel(sequelize: Sequelize): void {
    Sentiments.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      input: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      output: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: "Sentiments",
      modelName: "Sentiments",
      paranoid: true,
    })
  }



}

