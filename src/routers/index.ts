import express from "express";
import { apiRouter } from "@/components/api/api.router";
import { userRouter } from "@/components/user/controller/user.router";

const router = express.Router();

router.use("", apiRouter);
router.use(async (_, res, next) => {
  try {
    console.log(res.locals.user);
    return next();
  } catch ({ message }) {
    return res.status(401).send(message);
  }
  return next();
});
router.use("/users", userRouter);

export { router };
