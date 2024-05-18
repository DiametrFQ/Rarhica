import { Router } from "express";
import * as argon2 from "argon2";
import query from "../../DB.js";
const router = new Router();

router.get("/login", async (req, res) => {
  if (!req.session.user) {
    return res.render("login", { error: " ", login: "Login", role: "anon" });
  }

  const { id, login } = req.session.user;

  if (id) return res.redirect(`/profile/${id}`);
  else return res.render("login", { error: " ", login: login || "Login" });
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);

  const rez = await query("SELECT * FROM `user` WHERE login = ?", [login]).then(
    (rez) => rez[0]
  );

  if (!rez) return res.status(403).send("Incorrect user or password");

  const isValid = await argon2.verify(rez.password, password);

  if (!rez && isValid)
    return res.status(403).send("Incorrect user or password");
  req.session.user = { id: rez.id, role: rez.role, login: rez.login };

  res.json({ id: rez.id, role: rez.role, login: rez.login });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
