import express from "express";

require("dotenv").config();

const app = express();

const PORT: number = (process.env.PORT as unknown as number) || 3001;

app.get("/", function (_, res) {
  res.send("Hello World1!");
});

const server = app.listen(PORT, () =>
  console.log("server started on port", PORT)
);
