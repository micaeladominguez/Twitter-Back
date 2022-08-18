import {
  CreateUserInput,
  createUserInputSchema,
  UpdateUserInput,
  updateUserInputSchema,
} from "@/components/user/validator/types";

export class UserValidator {
  public static validateCreateUserBody(body: unknown): CreateUserInput {
    const result = createUserInputSchema.safeParse(body);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  }
  public static validateUpdateUserBody(body: unknown): UpdateUserInput {
    const result = updateUserInputSchema.safeParse(body);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  }
}
