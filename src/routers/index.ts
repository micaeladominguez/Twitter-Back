import express from "express";
import { apiRouter } from "@/components/api/api.router";
import { userRouter } from "@/components/user/controller/user.router";
import { signUpRouter } from "@/components/register/signup.router";
import { authRouter } from "@/components/auth/controller/auth.router";
import { logger } from "@/logger";
import { AuthService } from "@/components/auth/service/auth.service";
import { tweetRouter } from "@/components/tweet/controller/tweet.router";
import { followRouter } from "@/components/follow/controller/follow.router";
import { retweetRouter } from "@/components/retweet/controller/retweet.router";
import { likeRouter } from "@/components/like/controller/like.router";

const router = express.Router();

router.use("", apiRouter);
router.use("/register", signUpRouter);
router.use("/login", authRouter);
router.use(async (req, res, next) => {
  // I'm passing in the access token in header under key authorization
  const accessTokenFromClient = req.headers.authorization;
  // Fail if token not present in header.
  if (!accessTokenFromClient) {
    logger.info("No auth token found in req headers");
    return res.status(401).send("Access Token missing from header");
  }
  try {
    const token = accessTokenFromClient.split(" ")[1];
    res.locals.user = await AuthService.validateToken({
      jwt: token,
    });
    console.log(res.locals.user);
    return next();
  } catch ({ message }) {
    return res.status(401).send(message);
  }
  return next();
});

router.use("/users", userRouter);
router.use("/tweet", tweetRouter);
router.use("/follow", followRouter);
router.use("/retweet", retweetRouter);
router.use("/like", likeRouter);

export { router };
