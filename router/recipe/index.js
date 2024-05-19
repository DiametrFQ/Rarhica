"use strict";
import { Router } from "express";
import query from "../../DB.js";
const router = new Router();

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
  ]).then(([recipe, ingredients]) => {
    console.log("recipe", recipe);
    console.log("ingredient", ingredients);

    if (!req.session.user) {
      let login = "Login";
      let role = "anon";
      return res.render("recipe", { login, role, recipe, ingredients });
    } else {
      const { login, role } = req.session.user;
      return res.render("recipe", {
        login,
        role,
        recipe,
        ingredients,
      });
    }
  });
});

// router.post("/recipe", (_, res) => {
//     res.send("tech cookies");
// });

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

// router.delete("/", (_, res) => {
//   res("tech cookies");
// });

export default router;
