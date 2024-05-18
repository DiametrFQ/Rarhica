import { Router } from "express";
import Recipe from "./Recipes/index.js";
import query from "../../../DB.js";
const router = new Router();

router.use("/:id/recipes", Recipe);

router.get("/:id", (req, res) => {
  // if (req.session) {
  //   res.redirect("/login");
  // }
  const { login, role } = req.session.user;
  const { id: id_user } = req.params;

  console.log("PROFILE");

  query("SELECT * FROM `recipe` WHERE user_id = ?", [id_user]).then((recipes) =>
    res.render("viewprofile", { id_user, recipes, login, role })
  );

  //   let { id } = req.params;

  //   if (!id) {
  //     res.status(403).end();
  //   }
  //   const recipes = await query("SELECT * FROM `recipe` WHERE user_id = ?", [
  //     id_user,
  //   ]);

  //   query("SELECT * FROM `user` WHERE id = ?", [id]).then((user) => {
  //     res.render("profile", { id_user, recipes, login: "Logout" });
  //   });
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;

  if (!id) {
    res.status(403);
    res.end();
  }

  query("DELETE FROM `user` WHERE id = ?", [id]);

  res.status(200);
  res.end("ok");
});

export default router;
