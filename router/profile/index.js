import { Router } from "express";
import query from "../../DB.js";
import createResipes from "./CreateResipes/index.js";
const router = new Router();

router.get("/:id_user", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const { id: id_user } = req.session.user;
  console.log("session", req.session.user);

  console.log("id_user", id_user);
  const recipes = await query("SELECT * FROM `recipe` WHERE user_id = ?", [
    id_user,
  ]);

  res.render("profile", { id_user, recipes, login: "Logout" });
});

router.use("/:id_user/createRecipe", createResipes);

// router.post("/recipe", (_, res) => {
//     res.send("tech cookies");
// });

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

// router.delete("/", (_, res) => {
//   res("tech cookies");
// });

export default router;
