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
const PORTHTTP = process.env.PORTHTTP || 3001;
const PORTHTTPS = process.env.PORTHTTPS || 3002;

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

try {
  const key = readFileSync(__dirname + "/self.dev.key");
  const cert = readFileSync(__dirname + "/self.dev.crt");
  const options = { key, cert };
  var server = https.createServer(options, app);

  const appHTPP = express();

  appHTPP.use((req, res) => {
    res.redirect("https://localhost:" + PORTHTTPS + req.url);
  });

  appHTPP.listen(PORTHTTP, () => {
    console.log("http://localhost:" + PORTHTTP);
  });

  server.listen(PORTHTTPS, () => {
    console.log("https://localhost:" + PORTHTTPS);
  });
} catch {
  app.listen(PORTHTTP, () => {
    console.log("http://localhost:" + PORTHTTP);
  });
}
