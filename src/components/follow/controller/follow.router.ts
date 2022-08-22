import express from "express";
import { FollowService } from "@/components/follow/services/follow.service";
import prisma from "@/prisma";
import { UserService } from "@/components/user/services/user.service";

const router = express.Router();
const followService = new FollowService(prisma);
const userService = new UserService(prisma);
router.post("/:id", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const followingId = req.params.id;
    if (!followingId)
      res
        .status(404)
        .json({ response: { message: "Missing parameter" } })
        .send();
    const user = await userService.findUserById({ id: String(followingId) });
    if (!user)
      res
        .status(404)
        .json({ response: { message: "User does not exists" } })
        .send();

    const follow = await followService.createFollow(id, String(followingId));
    res.status(200).json({ response: follow }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/follows/", async (_, res) => {
  try {
    const { id } = res.locals.user;
    const follows = await followService.getFollows(id);
    res.status(200).json({ response: follows }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/follows/:id", async (req, res) => {
  try {
    const followsId = req.params.id;
    if (!followsId)
      res
        .status(404)
        .json({ response: { message: "Missing parameter" } })
        .send();
    const user = await userService.findUserById({ id: String(followsId) });
    if (!user)
      res
        .status(404)
        .json({ response: { message: "User does not exists" } })
        .send();
    const follows = await followService.getFollows(followsId);
    res.status(200).json({ response: follows }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/followers/", async (_, res) => {
  try {
    const { id } = res.locals.user;
    const follows = await followService.getFollowers(id);
    res.status(200).json({ response: follows }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/followers/:id", async (req, res) => {
  try {
    const followersId = req.params.id;
    if (!followersId)
      res
        .status(404)
        .json({ response: { message: "Missing parameter" } })
        .send();
    const user = await userService.findUserById({ id: String(followersId) });
    if (!user)
      res
        .status(404)
        .json({ response: { message: "User does not exists" } })
        .send();
    const { id } = res.locals.user;
    const follows = await followService.getFollowers(followersId);
    res.status(200).json({ response: follows }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const unfollowToId = req.params.id;
    if (!unfollowToId)
      res
        .status(404)
        .json({ response: { message: "Missing parameter" } })
        .send();
    const user = await userService.findUserById({ id: String(unfollowToId) });
    if (!user)
      res
        .status(404)
        .json({ response: { message: "User does not exists" } })
        .send();
    const { id } = res.locals.user;
    const follows = await followService.unfollow(id, unfollowToId);
    res.status(200).json({ response: follows }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as followRouter };
