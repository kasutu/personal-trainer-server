import { SystemController } from "~/controllers/system.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class SystemRoute extends Routes {
  private readonly controller = new SystemController();

  constructor() {
    super({ path: "/system" });
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.controller.getSystemStatus);
  }
}
