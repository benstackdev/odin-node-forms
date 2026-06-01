import { Router } from "express";
import { usersCreateGet, usersCreatePost, usersDeletePost, usersListGet, usersUpdateGet, usersUpdatePost } from "../controllers/userController.js";
const usersRouter = Router();

usersRouter.get("/", usersListGet);
usersRouter.get("/create", usersCreateGet);
usersRouter.post("/create", usersCreatePost);
usersRouter.get("/:id/update", usersUpdateGet);
usersRouter.post("/:id/update", usersUpdatePost);
usersRouter.post("/:id/delete", usersDeletePost);

export default usersRouter;