import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { AuthService } from "~/services/auth.service";
import type {
  CreateRolePayload,
  CreateUserPayload,
  UpdateRolePayload,
  UpdateUserPayload,
} from "~/services/auth.service";
import { createResponseDto } from "~/types/dto/response.dto";
import { hashPassword } from "~/utils/password";

export class AuthController {
  public async getUserById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.getUserById(Number(req.params.id));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.getUserByEmail(req.params.email);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const { email, username, password, lastLoginAt } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }
      const hashedPassword = await hashPassword(password);
      const payload: CreateUserPayload = {
        email,
        username,
        hashedPassword,
        lastLoginAt: lastLoginAt ? new Date(lastLoginAt) : undefined,
      };
      const result = await service.createUser(payload);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const { username, password, lastLoginAt } = req.body;
      const updateData: UpdateUserPayload = {};
      if (username !== undefined) updateData.username = username;
      if (lastLoginAt !== undefined)
        updateData.lastLoginAt = new Date(lastLoginAt);
      if (password) {
        updateData.hashedPassword = await hashPassword(password);
      }
      const result = await service.updateUser(
        Number(req.params.id),
        updateData
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.deleteUser(Number(req.params.id));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getRoleById(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.getRoleById(Number(req.params.id));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getRoleByName(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.getRoleByName(req.params.name);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createRole(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Role name is required" });
      }
      const payload: CreateRolePayload = { name, description };
      const result = await service.createRole(payload);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const { name, description } = req.body;
      const updateData: UpdateRolePayload = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      const result = await service.updateRole(
        Number(req.params.id),
        updateData
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async deleteRole(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.deleteRole(Number(req.params.id));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async assignRoleToUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(AuthService);
    try {
      const { userId, roleId } = req.body;
      const result = await service.assignRoleToUser(userId, roleId);
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getUserRoles(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.getUserRoles(Number(req.params.userId));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async removeUserRole(req: Request, res: Response, next: NextFunction) {
    const service = Container.get(AuthService);
    try {
      const result = await service.removeUserRole(
        Number(req.params.userRoleId)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
