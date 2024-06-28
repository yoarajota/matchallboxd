import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbDialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: dbDialect,
  host: dbHost,
});

export default sequelize;
