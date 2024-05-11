import { Router } from "express";
import query from "../../DB.js";
import createResipes from "./CreateResipes/index.js";
const router = new Router();

router.get("/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  res.render("profile", { id_user });
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
