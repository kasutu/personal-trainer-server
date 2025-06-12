import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

@Service()
export class SytemService {
  public getEnvironment(): string {
    return process.env.NODE_ENV ?? "development";
  }

  public async getDbStatus(): Promise<string> {
    try {
      // run inside `async` function
      await prisma.$connect();
      return "connected";
    } catch (error) {
      return "disconnected";
    } finally {
      await prisma.$disconnect();
    }
  }
}
