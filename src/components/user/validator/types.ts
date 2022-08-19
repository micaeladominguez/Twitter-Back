import * as z from "zod";

export const createUserInputSchema = z.object({
  name: z.string(),
  password: z.string(),
  phone: z.string(),
  email: z.string().email("Invalid mail format"),
});
export type CreateUserInput = {
  name: string;
  password: string;
  phone: string;
  email: string;
};
export const updateUserInputSchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserInput = {
  name?: string;
  password?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
};
