export class UserResponse {
  id!: string;
  name!: string;
  email!: string;
  phone?: string | null;
  isActive!: boolean;
  createdAt!: Date;
}
