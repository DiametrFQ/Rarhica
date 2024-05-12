import { Router } from "express";
const router = new Router();

router.get("/", (req, res) => {
  let login = "Login";
  console.log(req.session);
  if (req.session.user) {
    login = req.session.user.login;
  }

  res.render("home", { login });
});

export default router;
