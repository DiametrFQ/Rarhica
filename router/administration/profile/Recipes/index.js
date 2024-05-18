import { Router } from "express";
import query from "../../../../DB.js";
const router = new Router();

router.get("/:id", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { id: user_id, login, role } = req.session.user;
  const { method } = req.query;
  const { id: recipe_id } = req.params;
  let recipe = {};
  console.log("user_id", user_id);
  if (recipe_id)
    Promise.all([
      query("SELECT * FROM `Recipe` WHERE id = ?", [recipe_id]).then(
        (recipe) => recipe[0]
      ),
      query("SELECT * FROM `Ingredient` WHERE recipe_id = ?", [recipe_id]),
    ])
      .catch((err) => {
        console.log(err);
        res.status(400).end();
      })
      .then(([recipe, ingredients]) =>
        res.render("viewRecipe", {
          login,
          recipe_id,
          user_id,
          method,
          recipe,
          ingredients,
          role,
        })
      );
  else
    return res.render("viewRecipe", { user_id, method, recipe, login, role });
});

router.put("/:recipe_id", (req, res) => {
  const { recipe_id } = req.params;
  const { choise } = req.body;

  query("UPDATE `Recipe` SET `status` = ? WHERE `Recipe`.`id` = ?", [
    choise,
    recipe_id,
  ]).then(() => {
    res.status(202).end();
  });
});
router.delete("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;

  query("DELETE `Recipe` WHERE `Recipe`.`id` = ?", [recipe_id]).then(() => {
    res.status(202).end();
  });
});

export default router;
