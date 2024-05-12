import { Router } from "express";
const router = new Router();

router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { login } = req.session.user;

  res.render("feedback", { login });
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
