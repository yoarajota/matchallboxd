import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import routes from "./routes.js";
import cookieParser from "cookie-parser";
import wssUpgrade from "./webSocket/index.js";
import sequelize from "./helpers/sequelize.js";

config();

// ----- SERVER -----
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use("/api", routes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`✅ - Server running on port ${PORT}`);
});

try {
  server.on("upgrade", wssUpgrade);

  console.log("✅ - WEB SOCKET");
} catch (error) {
  console.log("❌ - SOCKET");
}

// ----- DB -----

// const MONGODB_URL = process.env.MONGODB_URL;

// if (MONGODB_URL) {
//   mongoose.connect(MONGODB_URL, { dbName: "db" });

//   const db = mongoose.connection;
//   mongoose.connection.on("error", function (err) {
//     console.log("❌ - DB");
//   });

//   db.once("open", function () {
//     console.log("✅ - DB");
//   });
// } else {
//   console.log("❌ - MONGO DB KEY MISSING");
// }

sequelize.authenticate().then(() => {
  console.log("✅ - DB");
});
