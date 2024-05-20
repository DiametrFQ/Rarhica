import { Router } from "express";
import query from "../../DB.js";
import createResipes from "./CreateResipes/index.js";
const router = new Router();

router.get("/:id_user", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const { id: id_user, role } = req.session.user;

  if (role === "admin") return res.redirect("/administration");

  query("SELECT * FROM `recipe` WHERE user_id = ?", [id_user])
    .then(
      async (recipes) =>
        await Promise.all(
          recipes.map(async (recipe) => {
            const avg = await query(
              "SELECT grade FROM `Grade` WHERE recipe_id = ?",
              [recipe.id]
            )
              .then((grades) => {
                return grades.length !== 0
                  ? grades.reduce((a, b) => a + b.grade, 0) / grades.length
                  : 0;
              })
              .then((avg) => avg.toFixed(2) || 0);
            return { ...recipe, avg };
          })
        )
    )
    .then(async (recipes) => {
      console.log("recipes", recipes);
      res.render("profile", {
        id_user,
        recipes: recipes,
        login: "Logout",
        role,
      });
    })
    .catch(() => res.status(400).send("Bad Request"));
});

router.use("/:id_user/createRecipe", createResipes);

// router.post("/recipe", (_, res) => {
//     res.send("tech cookies");
// });

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

router.delete("/:id", (req, res) => {
  let { id } = req.params;

  if (!id) {
    id = req.session.user.id;
  }
  if (!id) {
    res.status(403);
    res.end();
  }

  query("DELETE FROM `user` WHERE id = ?", [id]);

  res.status(200);
  res.end("ok");
});

export default router;
