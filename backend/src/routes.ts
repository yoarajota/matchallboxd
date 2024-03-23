import { Router } from "express";
import AuthController from "./controllers/AuthController";
import { secure } from "./middlewares/passport";

const routes = Router();

// Auth
routes.post("/", () => console.log("Hello World!"));
routes.post("/sign-up", AuthController.signup);
routes.post("/sign-in", AuthController.signin);
routes.post("/sign-out", AuthController.signout);
routes.get("/protected", secure);

export default routes;
