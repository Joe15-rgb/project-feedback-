import { Sentiments } from './Sentiments';
import { SequelizeConnection } from '../sequelizeConnectDatabase';

const sequelize = SequelizeConnection.getInstance()

Sentiments.initModel(sequelize)

export const db = {
  sequelize,
  Sentiments
}