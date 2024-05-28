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
            const [comment, avg] = await Promise.all([
              query("SELECT * FROM `reject_request` WHERE recipe_id = ?", [
                recipe.id,
              ]),
              query("SELECT grade FROM `Grade` WHERE recipe_id = ?", [
                recipe.id,
              ]),
            ])
              .catch(([comments, grades]) => {
                return [comments, grades.grade];
              })
              .then(([comments, grades]) => {
                grades =
                  grades.length !== 0
                    ? grades.reduce((a, b) => a + b.grade, 0) / grades.length
                    : 0;
                console.log("grades", grades);
                return [comments, grades];
              })
              .then(([comments, avg]) => [
                comments[0] || "",
                avg.toFixed(2) || 0,
              ]);
            console.log("avg", avg);
            console.log("comment", comment);
            return { ...recipe, avg, comment };
          })
        )
    )
    .then(async (recipes) => {
      res.render("profile", {
        id_user,
        recipes: recipes,
        login: "Logout",
        role,
      });
    });
  // .catch(() => res.status(400).send("Bad Request"));
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
