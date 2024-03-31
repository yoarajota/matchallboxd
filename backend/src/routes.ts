import { Router } from "express";
import AuthController from "./controllers/AuthController";
import { secure } from "./middlewares/passport";
import RoomsController from "./controllers/RoomsController";

const routes = Router();

// Auth
routes.post("/", () => console.log("Hello World!"));
routes.post("/sign-up", AuthController.signup);
routes.post("/sign-in", AuthController.signin);
routes.post("/sign-out", AuthController.signout);
routes.get("/me", secure, AuthController.me);

// Rooms
routes.post("/room/create", secure, RoomsController.create);
routes.get("/room/:id", secure, RoomsController.index);

export default routes;
