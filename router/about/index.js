import { Router } from "express";
import query from "../../DB.js";
import * as argon2 from "argon2";

const router = new Router();

router.get("/", async (req, res) => {
  if (!req.session.user)
    return res.render("about", { login: "Anon", role: "None" });
  const { login, role } = req.session.user;
  res.render("about", { login, role });
});

export default router;
