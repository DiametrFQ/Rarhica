"use strict";
import { Router } from "express";
import query from "../../DB.js";
import rating from "./rating/index.js";

const router = new Router();

router.use("/:id/rating", rating);

router.get("/:id", async (req, res) => {
  const { id: resipe_id } = req.params;
  console.log("resipe_id", resipe_id);

  Promise.all([
    query("SELECT * FROM `Recipe` WHERE id = ?", [resipe_id]).then(
      (recipe) => recipe[0]
    ),
    query("SELECT * FROM `Ingredient` WHERE recipe_id = ?", [resipe_id]).then(
      (ingredient) => ingredient
    ),
    query("SELECT grade FROM `Grade` WHERE recipe_id = ?", [resipe_id]).then(
      (grade) => {
        if (grade.length === 0) return 0;

        const arg =
          +grade.reduce((acc, curr) => acc + curr.grade, 0) / grade.length;

        return arg.toFixed(2);
      }
    ),
  ]).then(([recipe, ingredients, grade]) => {
    if (!req.session.user) {
      let login = "Login";
      let role = "anon";
      return res.render("recipe", { login, role, recipe, ingredients, grade });
    } else {
      const { login, role } = req.session.user;
      return res.render("recipe", {
        login,
        role,
        recipe,
        ingredients,
        grade,
      });
    }
  });
});

export default router;
