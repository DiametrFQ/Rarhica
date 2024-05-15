import { Router } from "express";
import query from "../../../../DB.js";
const router = new Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const { id: user_id, login } = req.session.user;
  const { method, id } = req.query;
  let recipe = {};

  if (id)
    Promise.all([
      query("SELECT * FROM `Recipe` WHERE id = ?", [id]).then(
        (recipe) => recipe[0]
      ),
      query("SELECT * FROM `Ingredient` WHERE recipe_id = ?", [id]),
    ]).then(([recipe, ingredients]) => {
      console.log("recipe", recipe);
      console.log("ingredient", ingredients);
      res.render("createRecipe", {
        user_id,
        method,
        recipe,
        ingredients,
      });
    });
  else res.render("createRecipe", { user_id, method, recipe, login });
});

router.put("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;
  const { name, img, about, ingredient, quantity, id } = req.body;

  query(
    "UPDATE `Recipe` SET `name` = ?, `img` = ?, `about` = ? WHERE `Recipe`.`id` = ?",
    [name, img, about, recipe_id]
  );

  res.status(200).end();
});
router.delete("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;

  query("DELETE FROM `recipe` WHERE `recipe`.`id` = ?", [recipe_id]);
  query("DELETE FROM `ingredient` WHERE `ingredient`.`recipe_id` = ?", [
    recipe_id,
  ]);
  res.status(200).end();
});

export default router;
