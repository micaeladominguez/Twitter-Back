export class Tweet {
  id!: string;
  content!: string;
  authorId!: string;
  createdAt!: Date;
  lastModification!: Date;
  deletedAt?: Date;
}
