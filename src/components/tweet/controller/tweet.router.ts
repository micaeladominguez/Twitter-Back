import express from "express";
import { TweetValidator } from "@/components/tweet/validator/tweet.validator";
import { TweetService } from "@/components/tweet/service/tweet.service";
import prisma from "@/prisma";
import { UserService } from "@/components/user/services/user.service";

const router = express.Router();
const tweetService = new TweetService(prisma);
router.post("/", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const validatedContent = TweetValidator.validateTweetBody(req.body);
    const tweet = await tweetService.createTweet({
      id: id,
      validatedTweetBody: validatedContent,
    });
    res.status(200).json({ response: tweet }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.delete("/", async (req, res) => {
  try {
    const tweetId = req.query.id;
    if (tweetId) {
      await tweetService.deleteTweet({
        id: String(tweetId),
      });
    }
    res
      .status(200)
      .json({ response: { message: "Deleted successfully" } })
      .send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/", async (_, res) => {
  try {
    const { id } = res.locals.user;
    const tweets = await tweetService.getMyTweets({
      id: id,
    });
    res.status(200).json({ response: tweets }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as tweetRouter };
