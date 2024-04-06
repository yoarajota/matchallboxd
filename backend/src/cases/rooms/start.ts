import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import tmdb from "../../clients/tmdb";
import WebSocket from "ws";
import cookie from "cookie";

const start = async (req: Request, res: Response) => {
  try {
    const { room } = req.query;

    const response = await tmdb.get(
      "/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
    );

    // Get random 10 movies of response list
    const movies = response?.data.results;
    const randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Handle the response
    const moviesList = [];
    for (const movie of randomMovies) {
      moviesList.push({
        id: movie.id,
        title: movie.title,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
      });
    }

    await new Promise((resolve, reject) => {
      const wsc = new WebSocket(
        `ws://${req.headers.host}?cookie=${req.headers.cookie}`
      );
      
      wsc.on("open", function open() {
        wsc.send(
          JSON.stringify({
            room,
            action: "start",
            data: {
              movies: moviesList,
            },
          })
        );

        resolve(wsc.readyState);
      });

      wsc.on("close", function close() {
        resolve(wsc.readyState);
        wsc.close();
      });

      wsc.on("error", function error(e) {
        wsc.close();
      });
    });

    return RestResponse.success(res, "Sala encontrada!", moviesList);
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Sala não encontrada!");
  }
};

export default start;
