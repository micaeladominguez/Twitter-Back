import express from "express";
import { TweetService } from "@/components/tweet/service/tweet.service";
import prisma from "@/prisma";
import { RetweetService } from "@/components/retweet/service/retweet.service";
import { LikeService } from "@/components/like/service/like.service";

const router = express.Router();
const tweetService = new TweetService(prisma);
const likeService = new LikeService(prisma);
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
    const possibleLike = await likeService.findOne(id, tweetId);
    if (possibleLike) res.status(200).json({ response: possibleLike }).send();
    else {
      const like = await likeService.createLike(id, tweetId);
      res.status(200).json({ response: like }).send();
    }
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
    const possibleLike = await likeService.findOne(id, tweetId);
    if (!possibleLike)
      res
        .status(400)
        .json({ response: { message: "Invalid tweet" } })
        .send();
    else {
      await likeService.deleteLike(possibleLike.id);
      res
        .status(200)
        .json({ response: { message: "Delete like successfully" } })
        .send();
    }
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/", async (_, res) => {
  try {
    const { id } = res.locals.user;
    const likes = await likeService.getLikes(id);
    res.status(200).json({ response: likes }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as likeRouter };
