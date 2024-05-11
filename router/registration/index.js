import { Router } from "express";
import query from "../../DB.js";
const router = new Router();

router.post("/", async (req, res) => {
  console.log("REGISTRATION");
  const { login, email, password } = req.body;
  console.log(login, email, password);

  query(
    "INSERT INTO `user` (`id`, `login`, `email`, `password`) VALUES (NULL, ?, ?, ?)",
    [login, email, password]
  );

  res.status(201).end();
});
//   res.render("profile", { id });
// });

// router.put("/", (_, res) => {
//   res("tech cookies");
// });

// router.delete("/", (_, res) => {
//   res("tech cookies");
// });

export default router;
