import { Router } from "express";
const router = new Router();

router.get("/", (_, res) => {
  res.render("feedback");
});

router.post("/", (_, res) => {
  res("tech cookies");
});

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

// router.delete("/", (_, res) => {
//   res("tech cookies");
// });

export default router;
