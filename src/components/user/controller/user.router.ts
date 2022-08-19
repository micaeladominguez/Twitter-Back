import express from "express";
import { UserService } from "@/components/user/services/user.service";
import { UserValidator } from "@/components/user/validator/user.validator";
const router = express.Router();
router.put("/", async (req, res) => {
  try {
    const { id } = res.locals.user;
    const validateBody = UserValidator.validateUpdateUserBody(req.body);
    const user = await UserService.updateUser({
      id: id,
      updateUserInput: validateBody,
    });
    res.status(200).json({ response: user }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as userRouter };
