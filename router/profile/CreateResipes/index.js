import { Router } from "express";
const router = new Router();

router.get("/", (req, res) => {
  const user_id = req._parsedOriginalUrl.path.split("/")[2];
  console.log(req._parsedOriginalUrl);
  res.render("createRecipe", { user_id });
});
// router.post("/:recipe_id", (req, res) => {
//   const recipe_id = req.params.recipe_id;
//   console.log(arr, recipe_id);
// });
// router.put("/:recipe_id", (req, res) => {
//   const recipe_id = req.params.recipe_id;
//   console.log(arr, recipe_id);
// });
// router.delete("/:recipe_id", (req, res) => {
//   const recipe_id = req.params.recipe_id;
//   console.log(arr, recipe_id);
// });

export default router;
