import { Router } from "express";
import query from "../../DB.js";
const router = new Router();

router.get("/login", async (req, res) => {
  if (!req.session.user) {
    return res.render("login", { error: " ", login: "Login" });
  }

  const { id, login } = req.session.user;

  if (id) return res.redirect(`/profile/${id}`);
  else return res.render("login", { error: " ", login: login || "Login" });
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);

  const rez = await query(
    "SELECT * FROM `user` WHERE login = ? AND password = ?",
    [login, password]
  )
    .then((rez) => rez[0])
    .catch((err) => {
      res.status(403);
      res.end();
    });

  req.session.user = { id: rez.id, role: rez.role, login: rez.login };

  res.json({ id: rez.id, role: rez.role, login: rez.login });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

router.delete("/", (_, res) => {
  res("tech cookies");
});

export default router;
