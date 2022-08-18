import express from "express";
import { UserService } from "@/components/user/services/user.service";
import { UserValidator } from "@/components/user/validator/user.validator";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const validateBody = UserValidator.validateUpdateUserBody(req.body);
    const user = await UserService.createUser({ name, email, password, phone });
    res.status(200).json({ response: user }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
router.put("/", async (req, res) => {
  try {
    const { id } = req.body;
    const validateBody = UserValidator.validateUpdateUserBody(req.body);
    const user = await UserService.updateUser({
      updateUserInput: validateBody,
      id: id,
    });
    res.status(200).json({ response: user }).send();
  } catch ({ message }) {
    res.status(404).json({ error: message }).send();
  }
});
export { router as userRouter };
