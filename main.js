"use strict";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config.js";

import sessionMiddleware from "./session.js";
import router from "./router/router.js";

const DN = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

app.set("view engine", "ejs");
app.set("views", join(DN, "views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(DN, "static")));
app.use(sessionMiddleware);
app.use(router);

app.get("/", (req, res) => {
  let login = "Login";
  if (req.session.user) {
    login = req.session.user.login;
  }

  res.render("home", { login: login || "Login" });
});

app.use((req, res) => {
  const { login } = req.session;
  console.log(req.session);
  res.status(404);
  res.render("error", {
    status: 404,
    message: "Page not found",
    login: login || "Login",
  });
});

app.listen(PORT, () => console.log("server started on port", PORT));
