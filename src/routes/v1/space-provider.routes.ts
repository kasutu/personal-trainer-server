import { SpaceProvidersController } from "~/controllers/space-provider.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class SpaceProvidersRoute extends Routes {
  private controller = new SpaceProvidersController();

  constructor() {
    super({ path: "/space-providers" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all and one
    this.router.get(`${this.path}`, this.controller.getAllSpaceProviders);
    this.router.get(`${this.path}/:id`, this.controller.getSpaceProviderById);

    // Create and update
    this.router.post(`${this.path}`, this.controller.createSpaceProvider);
    this.router.put(`${this.path}/:id`, this.controller.updateSpaceProvider);

    // Soft delete
    this.router.delete(
      `${this.path}/:id`,
      this.controller.softDeleteSpaceProvider
    );

    // Restore a soft-deleted provider
    this.router.patch(
      `${this.path}/:id/restore`,
      this.controller.restoreSpaceProvider
    );

    // Hard delete (use cautiously)
    this.router.delete(
      `${this.path}/:id/hard`,
      this.controller.hardDeleteSpaceProvider
    );
  }
}
