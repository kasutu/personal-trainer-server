import { AuthController } from "~/controllers/auth.controller";
import { Routes } from "~/types/infrastructure/routes.types";

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default class AuthRoute extends Routes {
  private readonly controller = new AuthController();

  constructor() {
    super({ path: "/auth" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/user/:id`,
      asyncHandler(this.controller.getUserById)
    );
    this.router.get(
      `${this.path}/user/by-email/:email`,
      asyncHandler(this.controller.getUserByEmail)
    );
    this.router.post(
      `${this.path}/user`,
      asyncHandler(this.controller.createUser)
    );
    this.router.put(
      `${this.path}/user/:id`,
      asyncHandler(this.controller.updateUser)
    );
    this.router.delete(
      `${this.path}/user/:id`,
      asyncHandler(this.controller.deleteUser)
    );

    this.router.get(
      `${this.path}/role/:id`,
      asyncHandler(this.controller.getRoleById)
    );
    this.router.get(
      `${this.path}/role/by-name/:name`,
      asyncHandler(this.controller.getRoleByName)
    );
    this.router.post(
      `${this.path}/role`,
      asyncHandler(this.controller.createRole)
    );
    this.router.put(
      `${this.path}/role/:id`,
      asyncHandler(this.controller.updateRole)
    );
    this.router.delete(
      `${this.path}/role/:id`,
      asyncHandler(this.controller.deleteRole)
    );

    this.router.post(
      `${this.path}/user-role`,
      asyncHandler(this.controller.assignRoleToUser)
    );
    this.router.get(
      `${this.path}/user/:userId/roles`,
      asyncHandler(this.controller.getUserRoles)
    );
    this.router.delete(
      `${this.path}/user-role/:userRoleId`,
      asyncHandler(this.controller.removeUserRole)
    );
    this.router.post(`${this.path}/login`, asyncHandler(this.controller.login));
  }
}
