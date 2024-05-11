import { Router } from "express";
const router = new Router();

router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.render("recipe");
});

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
