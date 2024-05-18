import { Router } from "express";
import query from "../../DB.js";

const router = new Router();

router.get("/", (req, res) => {
  if (!req.session?.user) return res.redirect("/login");

  const { login, role } = req.session.user;

  res.render("feedback", { login, role });
});

router.post("/", (req, res) => {
  const { id: user_id } = req.session.user;
  const { name, surname, phone, comment } = req.body;
  console.log(name, surname, phone, comment, user_id);
  query(
    "INSERT INTO `Feedback` (`id`, `name`, `surname`, `phone`, `comment`, `user_id`) VALUES (NULL, ?, ?, ?, ?, ?);",
    [name, surname, phone, comment, user_id]
  )
    .then(() => res.status(201).end())
    .catch((err) => {
      console.log(err);
      res.status(400).end();
    });
});

export default router;
