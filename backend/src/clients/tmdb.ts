import axios from "axios";
import { config } from "dotenv";

config();   

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3"
});

tmdb.defaults.headers.common["Authorization"] =
  "Bearer " + process.env.TMDB_API_TOKEN;
tmdb.defaults.headers.common["accept"] = "application/json";

export default tmdb;
