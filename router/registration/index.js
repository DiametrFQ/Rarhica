import { Router } from "express";
import query from "../../DB.js";
import * as argon2 from "argon2";

const router = new Router();

router.post("/", async (req, res) => {
  console.log("REGISTRATION");
  const { login, email, password } = req.body;
  const hash = await argon2.hash(password);

  const findUser = await query("SELECT * FROM `user` WHERE login = ?", [
    login,
  ]).then((rez) => rez[0]);

  if (findUser) return res.status(403).send("User already exists");

  query(
    "INSERT INTO `user` (`id`, `login`, `email`, `password`, `role`) VALUES (NULL, ?, ?, ?, 'user')",
    [login, email, hash]
  )
    .catch(() => {
      res.status(403).send("Incorrect user or password");
    })
    .then(async () => {
      res.status(201).send("Incorrect user or password");
    });
});

export default router;
