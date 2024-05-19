import { Router } from "express";
import query from "../../../DB.js";
const router = new Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const { id: user_id, login, role } = req.session.user;
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
      return res.render("createRecipe", {
        user_id,
        method,
        recipe,
        ingredients,
        login,
        role,
      });
    });
  else
    return res.render("createRecipe", {
      user_id,
      method,
      recipe,
      ingredients: [],
      login,
      role,
    });
});

router.post("/", async (req, res) => {
  const { name, img, about, user_id, ingredient, quantity } = req.body;

  if (!name || !img || !about || !user_id) return res.sta;

  query(
    "INSERT INTO `Recipe` (`id`, `name`, `img`, `about`, `status`, `user_id`) VALUES (NULL, ?, ?, ?, ?, ?)",
    [name, img, about, "wait", user_id]
  )
    .catch((err) => {
      console.log(err);
      res.status(400).send("Bad Request");
    })
    .then((recipe) => recipe.insertId)
    .then((recipe_id) => {
      if (ingredient)
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
    .catch((err) => {
      console.log(err);
      res.status(400).send("Bad Request");
    })
    .then(() => res.status(201).send("Recipe created"));
});
router.put("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;
  const { name, img, about, ingredient, quantity, id } = req.body;

  console.log("about.length", about.length);
  if (name.length > 254) {
    return res.status(400).send("Too long name");
  }
  if (img.length > 254) {
    return res.status(400).send("Too long url img");
  }
  if (about.length > 4094) {
    return res.status(400).send("Too long about data");
  }

  query("DELETE FROM `ingredient` WHERE `ingredient`.`recipe_id` = ?", [
    recipe_id,
  ]).then(() => {
    if (ingredient)
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
    "UPDATE `Recipe` SET `name` = ?, `img` = ?, `about` = ?, `status` = 'wait' WHERE `Recipe`.`id` = ?",
    [name, img, about, recipe_id]
  );

  res.status(200).send("Recipe updated");
});
router.delete("/:recipe_id", (req, res) => {
  const recipe_id = req.params.recipe_id;

  query("DELETE FROM `recipe` WHERE `recipe`.`id` = ?", [recipe_id]);
  query("DELETE FROM `ingredient` WHERE `ingredient`.`recipe_id` = ?", [
    recipe_id,
  ]);
  res.status(200).send("Recipe deleted");
});

export default router;
