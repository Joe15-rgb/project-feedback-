import { Dialect, Options, Sequelize } from "sequelize";

export class SequelizeConnection {
  private static instance: Sequelize;

  // Méthode pour obtenir l'instance de Sequelize
  static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      const dbConfig: Options = {
        storage: "../../database.sqlite",
        dialect: "sqlite" as Dialect,
        logging: false,
        // Ajoutez d'autres options si nécessaire
      };

      SequelizeConnection.instance = new Sequelize(dbConfig);
    }

    return SequelizeConnection.instance;
  }

  // Méthode pour établir la connexion à la base de données
  static async connect(): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize.authenticate(); // Utilisation de authenticate pour tester la connexion
      await sequelize.sync({ alter: false, force: false });
      console.log("Database connection successful");
      return sequelize;
    } catch (error) {
      console.error("Error while connecting to the database:", error);
      throw new Error("Database connection failed"); // Lancer une erreur pour indiquer un échec
    }
  }
}
