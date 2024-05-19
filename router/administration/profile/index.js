import { Router } from "express";
import Recipe from "./Recipes/index.js";
import query from "../../../DB.js";
const router = new Router();

router.use("/:id/recipes", Recipe);

router.get("/:id", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { login, role } = req.session.user;
  const { id: id_user } = req.params;

  console.log("PROFILE");

  query("SELECT * FROM `recipe` WHERE user_id = ?", [id_user]).then((recipes) =>
    res.render("viewprofile", { id_user, recipes, login, role })
  );
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;

  if (!id) {
    res.status(403).send("Forbidden");
    return;
  }

  query("DELETE FROM `user` WHERE id = ?", [id]);

  res.status(200).send("user deleted");
});

export default router;
