"use strict";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import https from "https";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import sessionMiddleware from "./session.js";
import router from "./router/router.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const key = readFileSync(__dirname + "/self.dev.key");
const cert = readFileSync(__dirname + "/self.dev.crt");
const options = {
  key: key,
  cert: cert,
};

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "static")));
app.use(sessionMiddleware);
app.use(router);

app.get("/", (_, res) => {
  return res.status(301).redirect("/home");
});

app.use((req, res) => {
  const { login, role } = req.session;
  console.log(req.session);
  res.status(404);
  res.render("error", {
    status: 404,
    message: "Page not found",
    login: login || "Login",
    role: role || "Anon",
  });
});

var server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log("https://localhost:" + PORT);
});
