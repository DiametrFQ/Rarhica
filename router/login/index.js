import { Router } from "express";
import query from "../../DB.js";
const router = new Router();

router.get("/", async (_, res) => {
  res.render("login", { error: " " });
});

router.post("/", async (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);

  const id = await query(
    "SELECT id FROM `user` WHERE login = ? AND password = ?",
    [login, password]
  ).then((id) => id[0]?.id);

  res.json({ id });
});

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

// router.delete("/", (_, res) => {
//   res("tech cookies");
// });

export default router;
