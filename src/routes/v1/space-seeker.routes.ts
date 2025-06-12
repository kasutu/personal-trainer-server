import { SpaceSeekerController } from "~/controllers/space-seeker.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class SpaceSeekerRoute extends Routes {
  private controller = new SpaceSeekerController();

  constructor() {
    super({ path: "/space-seeker" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all space seekers and get a single space seeker by ID
    this.router.get(`${this.path}`, this.controller.getAllSpaceSeekers);
    this.router.get(`${this.path}/:id`, this.controller.getSpaceSeekerById);

    // Create and update a space seeker
    this.router.post(`${this.path}`, this.controller.createSpaceSeeker);
    this.router.put(`${this.path}/:id`, this.controller.updateSpaceSeeker);

    // Soft delete, restore, and hard delete a space seeker
    this.router.delete(
      `${this.path}/:id`,
      this.controller.softDeleteSpaceSeeker
    );
    this.router.patch(
      `${this.path}/:id/restore`,
      this.controller.restoreSpaceSeeker
    );
    this.router.delete(
      `${this.path}/:id/hard`,
      this.controller.hardDeleteSpaceSeeker
    );
  }
}
