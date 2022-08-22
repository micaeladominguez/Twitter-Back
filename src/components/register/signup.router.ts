import express from "express";
import { UserValidator } from "@/components/user/validator/user.validator";
import {UserService} from "@/components/user/services/user.service";
import prisma from "@/prisma";

const router = express.Router();
const userService = new UserService(prisma);
router.post("/", async (req, res) => {
  try {
    const userBody = req.body;
    const validatedBody = UserValidator.validateCreateUserBody(userBody);
    const user = await userService.createUser(validatedBody);
    res.status(201).json({ response: user }).send();
  } catch ({ message }) {
    res.status(400).json({ error: message }).send();
  }
});
export { router as signUpRouter };
