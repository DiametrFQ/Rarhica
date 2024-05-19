import { Router } from "express";
import query from "../../DB.js";

const router = new Router();

router.get("/", (req, res) => {
  let login = "Login";
  let role = "anon";

  console.log(req.session);
  if (req.session.user) {
    login = req.session.user.login;
    role = req.session.user.role;
  }

  res.render("home", { login, role });
});

router.post("/search", async (req, res) => {
  let login = "Login";
  let role = "anon";

  const { query: search } = req.body;

  if (req.session.user) {
    login = req.session.user.login;
    role = req.session.user.role;
  }

  await query(
    "SELECT * FROM `Recipe` WHERE (name LIKE ? OR about LIKE ?) AND status = 'approved'",
    [search, search]
  )
    .then((recipes) => res.json({ recipes, login, role }))
    .catch(() => res.status(400).send("Bad Request"));
});

export default router;
