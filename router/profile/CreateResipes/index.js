import { Router } from "express";
import query from "../../../DB.js";
const router = new Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const { id: user_id, login } = req.session.user;
  const { method, id } = req.query;
  let recipe = {};

  if (user_id)
    Promise.all([
      query("SELECT * FROM `Recipe` WHERE id = ?", [id]).then(
        (recipe) => recipe[0]
      ),
      query("SELECT * FROM `Ingredient` WHERE recipe_id = ?", [id]).then(
        (ingredient) => ingredient
      ),
    ]).then(([recipe, ingredients]) => {
      console.log("recipe", recipe);
      console.log("ingredient", ingredients);
      res.render("createRecipe", {
        user_id,
        method,
        recipe,
        ingredients,
        login,
      });
    });
  else
    res.render("createRecipe", {
      user_id,
      method,
      recipe,
      ingredients: [],
      login,
    });
});

router.post("/", (req, res) => {
  const { name, img, about, user_id, ingredient, quantity } = req.body;

  if (!name || !img || !about || !user_id)
    return res.status(400).json({ error: "Fill all fields" });

  console.log(name, img, about, user_id, ingredient, quantity);
  query(
    "INSERT INTO `Recipe` (`id`, `name`, `img`, `about`, `status`, `user_id`) VALUES (NULL, ?, ?, ?, ?, ?)",
    [name, img, about, "wait", user_id]
  )
    .then((recipe) => recipe.insertId)
    .then((recipe_id) => {
      if (Array.isArray(ingredient))
        ingredient.forEach((name, i) => {
          if (name || quantity[i])
            query(
              "INSERT INTO `ingredient` (`id`, `name`, `quantity`, `recipe_id`) VALUES (NULL, ?, ?, ?)",
              [name, quantity[i], recipe_id]
            );
        });
      else
        query(
          "INSERT INTO `ingredient` (`id`, `name`, `quantity`, `recipe_id`) VALUES (NULL, ?, ?, ?)",
          [ingredient, quantity, recipe_id]
        );
    })
    .then(() => console.log("success"));

  res.status(201).end();
});
router.put("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;
  const { name, img, about, ingredient, quantity, id } = req.body;

  query("DELETE FROM `ingredient` WHERE `ingredient`.`recipe_id` = ?", [
    recipe_id,
  ]).then(() => {
    if (Array.isArray(ingredient))
      ingredient.forEach((name, i) => {
        if (name || quantity[i])
          query(
            "INSERT INTO `ingredient` (`id`, `name`, `quantity`, `recipe_id`) VALUES (NULL, ?, ?, ?)",
            [name, quantity[i], recipe_id]
          );
      });
    else
      query(
        "INSERT INTO `ingredient` (`id`, `name`, `quantity`, `recipe_id`) VALUES (NULL, ?, ?, ?)",
        [ingredient, quantity, recipe_id]
      );
  });
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
