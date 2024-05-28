import { Router } from "express";
import query from "../../../../DB.js";
const router = new Router();

router.get("/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(302).redirect("/login");
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
      .catch(() => {
        res.status(400).send("Bad request");
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
  const admin_id = req.session.user.id;
  const { recipe_id } = req.params;
  const { choise, text } = req.body;
  console.log("text", text);

  Promise.all([
    query("UPDATE `Recipe` SET `status` = ? WHERE `Recipe`.`id` = ?", [
      choise,
      recipe_id,
    ]),

    query(
      "INSERT `reject_request` SET `date` = ?, `comment` = ?, `recipe_id` = ?, `admin_id` = ?",
      [new Date(Date.now()).toLocaleDateString("ru"), text, recipe_id, admin_id]
    ),
  ]).then(() => {
    res.status(202).send("Recipe " + choise);
  });
});

router.delete("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;

  query("DELETE `Recipe` WHERE `Recipe`.`id` = ?", [recipe_id]).then(() => {
    res.status(202).end("Recipe deleted");
  });
});

export default router;
