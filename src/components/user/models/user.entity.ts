export class User {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  phone?: string | null;
  isActive!: boolean;
}
