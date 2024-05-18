import { Router } from "express";
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

export default router;
