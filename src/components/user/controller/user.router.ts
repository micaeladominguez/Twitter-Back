import express from "express";
import { UserService } from "@/components/user/services/user.service";
import { UserValidator } from "@/components/user/validator/user.validator";
import prisma from "@/prisma";
const router = express.Router();
const userService = new UserService(prisma);
router.put("/", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const validateBody = UserValidator.validateUpdateUserBody(req.body);
    const user = await userService.updateUser({
      id: id,
      updateUserInput: validateBody,
    });
    res.status(200).json({ response: user }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.get("/me", async (_, res) => {
  try {
    const { id } = res.locals.user;
    const user = await userService.findUserById({
      id: id,
    });
    res
      .status(200)
      .json({
        response: {
          user,
        },
      })
      .send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});

router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    let users;
    if (email) {
      users = await userService.allUsersLike({ email: String(email) });
    } else {
      users = await userService.allUsers();
    }
    res
      .status(200)
      .json({
        response: { users },
      })
      .send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});UserService
router.put("/block", async (req, res) => {
  try {
    const id = req.query.id;
    let user;
    if (id) {
      user = userService.blockUser({ id: String(id) });
    }
    if (user) {
      res
        .status(200)
        .json({ response: { message: "User is correctly blocked" } });
    } else {
      res.status(404).json({ message: "User couldn't be blocked" }).send();
    }
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as userRouter };
