import { Router } from "express";
import query from "../../DB.js";
import profile from "./profile/index.js";

const router = new Router();

router.use("/profile", profile);

router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { login, role, id } = req.session.user;

  if (role !== "admin") res.status(403).redirect("/profile/" + id);

  const allUsers = await query("SELECT * FROM `user`");
  res.render("administration", { login, allUsers });
});

router.post("/", (_, res) => {
  res("tech cookies");
});

router.put("/", (_, res) => {
  res("tech cookies");
});

router.delete("/", (_, res) => {
  res("tech cookies");
});

export default router;
