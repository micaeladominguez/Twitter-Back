export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  phone?: string | null;
  isActive!: boolean;
  createdAt!: Date;
}
