import express from "express";
import { UserValidator } from "@/components/user/validator/user.validator";
import { UserService } from "@/components/user/services/user.service";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userBody = req.body;
    const validatedBody = UserValidator.validateCreateUserBody(userBody);
    const user = await UserService.createUser({
      createUserInput: validatedBody,
    });
    res.status(201).json({ response: {user: {id:user.id, name: user.name, email: user.email, phone: user.phone}} }).send();
  } catch ({ message }) {
    res.status(400).json({ error: message }).send();
  }
});
export { router as signUpRouter };
