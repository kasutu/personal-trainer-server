import { BuildingController } from "~/controllers/building.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class BuildingRoute extends Routes {
  private controller = new BuildingController();

  constructor() {
    super({ path: "/buildings" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all buildings and get a single building by ID
    this.router.get(`${this.path}`, this.controller.getAllBuildings);
    this.router.get(`${this.path}/:id`, this.controller.getBuildingById);

    // Create and update a building
    this.router.post(`${this.path}`, this.controller.createBuilding);
    this.router.put(`${this.path}/:id`, this.controller.updateBuilding);

    // Soft delete, restore, and hard delete a building
    this.router.delete(`${this.path}/:id`, this.controller.softDeleteBuilding);
    this.router.patch(
      `${this.path}/:id/restore`,
      this.controller.restoreBuilding
    );
    this.router.delete(
      `${this.path}/:id/hard`,
      this.controller.hardDeleteBuilding
    );
  }
}
