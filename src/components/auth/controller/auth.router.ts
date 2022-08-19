import express from "express";
import { AuthService } from "@/components/auth/service/auth.service";

const router = express.Router();

router.post("/", async (req, res) => {
  //Authenticate User
  try {
    const userBody = req.body;
    //const validatedBody = UserValidator.validateCreateUserBody(userBody);
    const user = { email: userBody.email, password: userBody.password };
    const accessToken = await AuthService.authenticateUser(user);
    res.status(200).json({ response: accessToken }).send();
  } catch ({ message }) {
    res.status(400).json({ error: message }).send();
  }
});
export { router as authRouter };
