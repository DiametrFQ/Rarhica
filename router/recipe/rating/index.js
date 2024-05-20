"use strict";
import { Router } from "express";
import query from "../../../DB.js";
const router = new Router();

// router.get("/:id", async (req, res) => {
//   const { id: resipe_id } = req.params;
//   console.log("resipe_id", resipe_id);

//   Promise.all([
//     query("SELECT * FROM `Recipe` WHERE id = ?", [resipe_id]).then(
//       (recipe) => recipe[0]
//     ),
//     query("SELECT * FROM `Ingredient` WHERE recipe_id = ?", [resipe_id]).then(
//       (ingredient) => ingredient
//     ),
//   ]).then(([recipe, ingredients]) => {
//     console.log("recipe", recipe);
//     console.log("ingredient", ingredients);

//     if (!req.session.user) {
//       let login = "Login";
//       let role = "anon";
//       return res.render("recipe", { login, role, recipe, ingredients });
//     } else {
//       const { login, role } = req.session.user;
//       return res.render("recipe", {
//         login,
//         role,
//         recipe,
//         ingredients,
//       });
//     }
//   });
// });

// router.post("/", (req, res) => {
//   if(!req.session.user) return res.status(401).send("Unauthorized");

//   const { id: user_id } = req.session.user;
//   const { resipe_id, grade } = req.body;

//   query("INSERT INTO `Grade` (`id`, `recipe_id`, `user_id`, `grade`) VALUES (NULL, '21', '42', '4')", [resipe_id, user_id, grade])
//     .then(() => res.status(200).send("Оценка добавлена"))
//     .catch(() => res.status(400).send("Bad request"))

// });

router.put("/", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Unauthorized");
  const { id: user_id } = req.session.user;
  const { resipe_id, grade } = req.body;
  console.log("resipe_id", resipe_id);
  console.log("user_id", user_id);
  console.log("grade", grade);

  const gradeExists = await query(
    "SELECT grade FROM `Grade` WHERE recipe_id = ? AND user_id = ?",
    [resipe_id, user_id]
  ).then((grade) => grade[0]);

  console.log("gradeExists", gradeExists);

  if (!gradeExists) {
    query(
      "INSERT INTO `Grade` (`id`, `recipe_id`, `user_id`, `grade`) VALUES (NULL, ?, ?, ?)",
      [resipe_id, user_id, grade]
    )
      .then(() => res.status(200).send("Оценка добавлена"))
      .catch(() => res.status(400).send("Bad request"));
  } else {
    query(
      "UPDATE `Grade` SET `grade` = ? WHERE recipe_id = ? AND user_id = ?",
      [grade, resipe_id, user_id]
    )
      .then(() => res.status(200).send("Оценка обновлена"))
      .catch(() => res.status(400).send("Bad request"));
  }
});

export default router;
