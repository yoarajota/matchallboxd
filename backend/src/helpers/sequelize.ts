import { Dialect, Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const host = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbDialect = process.env.DB_DIALECT;
const port = parseInt(process.env.DB_HOST_PORT) ?? 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: dbDialect as Dialect,
  host,
  port,
});

export default sequelize;
