import express from "express";
import { TweetValidator } from "@/components/tweet/validator/tweet.validator";
import { TweetService } from "@/components/tweet/service/tweet.service";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const validatedContent = TweetValidator.validateTweetBody(req.body);
    const tweet = await TweetService.createTweet({
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
    const { id } = res.locals.user;
    const tweetId = req.query.id;
    if (tweetId) {
      await TweetService.deleteTweet({
        id: String(tweetId),
        userId: id,
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
    const tweets = await TweetService.getMyTweets({
      id: id,
    });
    res.status(200).json({ response: tweets }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as tweetRouter };
