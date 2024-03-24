"use strict";

import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import "dotenv/config.js";

import router from "./router/router.js";

const DN = dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("view engine", "ejs");
app.set("views", join(DN, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(DN));

const PORT = process.env.PORT || 3001;

app.use(router);

app.get("/", (_, res) => {
  res.render("home");
});

app.get("*", (_, res) => {
  res.render("error", {
    status: 404,
    message: "Page not found",
  });
});
app.post("*", (_, res) => {
  res.status(404);
  res.render("error", {
    status: 404,
    message: "Page not found",
  });
});

const server = app.listen(PORT, () =>
  console.log("server started on port", PORT)
);
