import { Router } from "express";
import AuthController from "./controllers/AuthController";
import { secure } from "./middlewares/passport";

const routes = Router();

// Auth
routes.post("/", () => console.log("Hello World!"));
routes.post("/signup", AuthController.signup);
routes.post("/login", AuthController.login);
routes.post("/logout", AuthController.logout);
routes.get("/protected", secure);

export default routes;
