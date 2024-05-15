import { Router } from "express";
import query from "../../DB.js";
const router = new Router();

router.post("/", async (req, res) => {
  console.log("REGISTRATION");
  const { login, email, password } = req.body;
  console.log(login, email, password);

  query(
    "INSERT INTO `user` (`id`, `login`, `email`, `password`, `role`) VALUES (NULL, ?, ?, ?, 'user')",
    [login, email, password]
  )
    .then(() => {
      res.status(201).end();
    })
    .catch(() => {
      res.status(403).end();
    });
});

export default router;
