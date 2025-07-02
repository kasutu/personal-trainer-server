import type { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { CredentialsService } from "~/services/auth.service";
import { createResponseDto } from "~/types/dto/response.dto";
import { hashPassword } from "~/utils/password";

export class CredentialsController {
  // Member credentials
  public async getMemberCredentialsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getMemberCredentialsById(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getMemberCredentialsByMemberId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getMemberCredentialsByMemberId(
        Number(req.params.memberId)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getMemberCredentialsByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getMemberCredentialsByEmail(
        req.params.email
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createMemberCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { email, password } = req.body;
      const hashedPassword = await hashPassword(password);
      const result = await service.createMemberCredentials({
        email,
        hashedPassword,
      });
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateMemberCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { email, password } = req.body;
      let updateData: any = { email };
      if (password) {
        updateData.hashedPassword = await hashPassword(password);
      }
      const result = await service.updateMemberCredentials(
        Number(req.params.id),
        updateData
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async deleteMemberCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.deleteMemberCredentials(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  // Instructor credentials
  public async getInstructorCredentialsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getInstructorCredentialsById(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getInstructorCredentialsByInstructorId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getInstructorCredentialsByInstructorId(
        Number(req.params.instructorId)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getInstructorCredentialsByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getInstructorCredentialsByUsername(
        req.params.username
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createInstructorCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username, password, instructorId } = req.body;
      const hashedPassword = await hashPassword(password);
      const result = await service.createInstructorCredentials({
        username,
        hashedPassword,
        instructor: { connect: { id: instructorId } },
      });
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateInstructorCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username, password } = req.body;
      let updateData: any = { username };
      if (password) {
        updateData.hashedPassword = await hashPassword(password);
      }
      const result = await service.updateInstructorCredentials(
        Number(req.params.id),
        updateData
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async deleteInstructorCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.deleteInstructorCredentials(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  // Admin credentials
  public async getAdminCredentialsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getAdminCredentialsById(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getAdminCredentialsByAdminId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getAdminCredentialsByAdminId(
        Number(req.params.adminId)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getAdminCredentialsByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getAdminCredentialsByUsername(
        req.params.username
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async createAdminCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username, password, adminId } = req.body;
      const hashedPassword = await hashPassword(password);
      const result = await service.createAdminCredentials({
        username,
        hashedPassword,
        admin: { connect: { id: adminId } },
      });
      res.status(201).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async updateAdminCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username, password } = req.body;
      let updateData: any = { username };
      if (password) {
        updateData.hashedPassword = await hashPassword(password);
      }
      const result = await service.updateAdminCredentials(
        Number(req.params.id),
        updateData
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async deleteAdminCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.deleteAdminCredentials(
        Number(req.params.id)
      );
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  // Username/email availability
  public async isMemberEmailAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { email } = req.query;
      const result = await service.isMemberEmailAvailable(String(email));
      res.status(200).json(createResponseDto({ available: result }));
    } catch (error) {
      next(error);
    }
  }

  public async isInstructorUsernameAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username } = req.query;
      const result = await service.isInstructorUsernameAvailable(
        String(username)
      );
      res.status(200).json(createResponseDto({ available: result }));
    } catch (error) {
      next(error);
    }
  }

  public async isAdminUsernameAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username, excludeAdminId } = req.query;
      const result = await service.isAdminUsernameAvailable(
        String(username),
        excludeAdminId ? Number(excludeAdminId) : undefined
      );
      res.status(200).json(createResponseDto({ available: result }));
    } catch (error) {
      next(error);
    }
  }

  public async isUsernameGloballyAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username } = req.query;
      const result = await service.isUsernameGloballyAvailable(
        String(username)
      );
      res.status(200).json(createResponseDto({ available: result }));
    } catch (error) {
      next(error);
    }
  }

  // Find credentials by username (across all types)
  public async findCredentialsByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const { username } = req.query;
      const result = await service.findCredentialsByUsername(String(username));
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  // Stats and activity
  public async getCredentialsStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const result = await service.getCredentialsStats();
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }

  public async getRecentLoginActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const service = Container.get(CredentialsService);
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await service.getRecentLoginActivity(limit);
      res.status(200).json(createResponseDto(result));
    } catch (error) {
      next(error);
    }
  }
}
