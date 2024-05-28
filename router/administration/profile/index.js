import { Router } from "express";
import Recipe from "./Recipes/index.js";
import query from "../../../DB.js";
const router = new Router();

router.use("/:id/recipes", Recipe);

router.get("/:id", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { login, role } = req.session.user;
  const { id: id_user } = req.params;

  query("SELECT * FROM `recipe` WHERE user_id = ? AND status = 'wait'", [
    id_user,
  ])
    .then((recipes) => {
      return recipes.map(async (recipe) => {
        return {
          ...recipe,
          avg: await query("SELECT grade FROM `grade` WHERE recipe_id = ?", [
            recipe.id,
          ]).then((grades) =>
            grades.length !== 0
              ? grades.reduce((a, b) => a + b.grade, 0) / grades.length
              : 0
          ),
        };
      });
    })
    .then((recipes) => Promise.all(recipes))
    .then((recipes) => {
      const recipess = recipes;
      res.render("viewprofile", { id_user, recipes: recipess, login, role });
    });
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
