import express from "express";
import { TweetService } from "@/components/tweet/service/tweet.service";
import prisma from "@/prisma";
import { RetweetService } from "@/components/retweet/service/retweet.service";

const router = express.Router();
const tweetService = new TweetService(prisma);
const retweetService = new RetweetService(prisma);
router.post("/?:tweetId", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const tweetId = req.params.tweetId;
    if (!tweetId)
      res
        .status(400)
        .json({ response: { message: "Invalid params" } })
        .send();
    const tweet = await tweetService.findById(tweetId);
    if (!tweet)
      res
        .status(400)
        .json({ response: { message: "Invalid tweet" } })
        .send();
    const retweet = await retweetService.createRetweet(id, tweetId);
    res.status(200).json({ response: retweet }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.delete("/?:tweetId", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const tweetId = req.params.tweetId;
    if (!tweetId)
      res
        .status(400)
        .json({ response: { message: "Invalid params" } })
        .send();
    const tweet = await tweetService.findById(tweetId);
    if (!tweet)
      res
        .status(400)
        .json({ response: { message: "Invalid tweet" } })
        .send();
    await retweetService.deleteRetweet(id, tweetId);
    res
      .status(200)
      .json({ response: { message: "Delete retweet successfully" } })
      .send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as retweetRouter };
