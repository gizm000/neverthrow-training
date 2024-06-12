import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user.entity";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async save(user: User) {
    return this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      update: {
        name: user.name,
        email: user.email,
      },
    });
  }
}
