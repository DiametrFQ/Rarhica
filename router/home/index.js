import { Router } from "express";
import query from "../../DB.js";

const router = new Router();

router.get("/", (req, res) => {
  let login = "Login";
  let role = "anon";

  console.log(req.session);
  if (req.session.user) {
    login = req.session.user.login;
    role = req.session.user.role;
  }

  res.render("home", { login, role });
});

router.post("/search", (req, res) => {
  let login = "Login";
  let role = "anon";

  const { query: search } = req.body;

  if (req.session.user) {
    login = req.session.user.login;
    role = req.session.user.role;
  }

  query(
    "SELECT * FROM `Recipe` WHERE (name LIKE ? OR about LIKE ?) AND status = 'approved'",
    [search, search]
  )
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
    .then((recipes) => res.json({ recipes, login, role }))
    .catch(() => res.status(400).send("Bad Request"));
});

export default router;
