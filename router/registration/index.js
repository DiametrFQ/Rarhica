import { Router } from "express";
import query from "../../DB.js";
import * as argon2 from "argon2";

const router = new Router();

router.post("/", async (req, res) => {
  const { login, email, password } = req.body;

  const findUser = await query("SELECT * FROM `user` WHERE login = ?", [
    login,
  ]).then((rez) => rez[0]);

  if (findUser) return res.status(409).send("User already exists");

  const hash = await argon2.hash(password);
  query(
    "INSERT INTO `user` (`id`, `login`, `email`, `password`, `role`) VALUES (NULL, ?, ?, ?, 'user')",
    [login, email, hash]
  )
    .catch(() => {
      res.status(400).send("Incorrect user or password");
    })
    .then(async () => {
      res.status(201).send("Incorrect user or password");
    });
});

export default router;
