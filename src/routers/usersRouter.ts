import { Router } from "express";
import { usersCreateGet, usersCreatePost, usersDeletePost, usersListGet, usersSearchGet, usersSearchPost, usersUpdateGet, usersUpdatePost, validateSearch, validateUser } from "../controllers/userController.js";
import { matchedData, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import usersData from "../storages/userStorage.js";

const usersRouter = Router();

usersRouter.get("/", usersListGet);

usersRouter.get("/create", usersCreateGet);

// Note: for TypeScript to not throw a fit over an overload, I had to put the validation chain and the middleware directly in the POST request in the router. Probably a hack.
usersRouter.post("/create", validateUser, usersCreatePost);

usersRouter.get("/:id/update", usersUpdateGet);

usersRouter.post("/:id/update", validateUser, usersUpdatePost);

usersRouter.post("/:id/delete", usersDeletePost);

usersRouter.get("/search", usersSearchGet);

usersRouter.post("/search", validateSearch, usersSearchPost);

export default usersRouter;