import { SpaceController } from "~/controllers/space.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class SpaceRoute extends Routes {
  private controller = new SpaceController();

  constructor() {
    super({ path: "/spaces" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all spaces and get a single space by ID
    this.router.get(`${this.path}`, this.controller.getAllSpaces);
    this.router.get(`${this.path}/:id`, this.controller.getSpaceById);

    // Create and update a space
    this.router.post(`${this.path}`, this.controller.createSpace);
    this.router.put(`${this.path}/:id`, this.controller.updateSpace);

    // Soft delete, restore, and hard delete a space
    this.router.delete(`${this.path}/:id`, this.controller.softDeleteSpace);
    this.router.patch(`${this.path}/:id/restore`, this.controller.restoreSpace);
    this.router.delete(
      `${this.path}/:id/hard`,
      this.controller.hardDeleteSpace
    );
  }
}
