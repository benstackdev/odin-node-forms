import express from "express";
import { fileURLToPath } from "node:url";
import path from "path";
import usersRouter from "./routers/usersRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}`);
});