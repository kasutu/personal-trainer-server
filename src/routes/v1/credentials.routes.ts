import { CredentialsController } from "~/controllers/credentials.controller";
import { Routes } from "~/types/infrastructure/routes.types";

export default class CredentialsRoute extends Routes {
  private controller = new CredentialsController();

  constructor() {
    super({ path: "/credentials" });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Member credentials
    this.router.get(
      `${this.path}/member/:id`,
      this.controller.getMemberCredentialsById
    );
    this.router.get(
      `${this.path}/member/by-member/:memberId`,
      this.controller.getMemberCredentialsByMemberId
    );
    this.router.get(
      `${this.path}/member/by-email/:email`,
      this.controller.getMemberCredentialsByEmail
    );
    this.router.post(
      `${this.path}/member`,
      this.controller.createMemberCredentials
    );
    this.router.put(
      `${this.path}/member/:id`,
      this.controller.updateMemberCredentials
    );
    this.router.delete(
      `${this.path}/member/:id`,
      this.controller.deleteMemberCredentials
    );

    // Instructor credentials
    this.router.get(
      `${this.path}/instructor/:id`,
      this.controller.getInstructorCredentialsById
    );
    this.router.get(
      `${this.path}/instructor/by-instructor/:instructorId`,
      this.controller.getInstructorCredentialsByInstructorId
    );
    this.router.get(
      `${this.path}/instructor/by-username/:username`,
      this.controller.getInstructorCredentialsByUsername
    );
    this.router.post(
      `${this.path}/instructor`,
      this.controller.createInstructorCredentials
    );
    this.router.put(
      `${this.path}/instructor/:id`,
      this.controller.updateInstructorCredentials
    );
    this.router.delete(
      `${this.path}/instructor/:id`,
      this.controller.deleteInstructorCredentials
    );

    // Admin credentials
    this.router.get(
      `${this.path}/admin/:id`,
      this.controller.getAdminCredentialsById
    );
    this.router.get(
      `${this.path}/admin/by-admin/:adminId`,
      this.controller.getAdminCredentialsByAdminId
    );
    this.router.get(
      `${this.path}/admin/by-username/:username`,
      this.controller.getAdminCredentialsByUsername
    );
    this.router.post(
      `${this.path}/admin`,
      this.controller.createAdminCredentials
    );
    this.router.put(
      `${this.path}/admin/:id`,
      this.controller.updateAdminCredentials
    );
    this.router.delete(
      `${this.path}/admin/:id`,
      this.controller.deleteAdminCredentials
    );

    // Username/email availability
    this.router.get(
      `${this.path}/member/email-available`,
      this.controller.isMemberEmailAvailable
    );
    this.router.get(
      `${this.path}/instructor/username-available`,
      this.controller.isInstructorUsernameAvailable
    );
    this.router.get(
      `${this.path}/admin/username-available`,
      this.controller.isAdminUsernameAvailable
    );
    this.router.get(
      `${this.path}/username-available`,
      this.controller.isUsernameGloballyAvailable
    );

    // Find credentials by username (across all types)
    this.router.get(
      `${this.path}/find-by-username`,
      this.controller.findCredentialsByUsername
    );

    // Stats and activity
    this.router.get(`${this.path}/stats`, this.controller.getCredentialsStats);
    this.router.get(
      `${this.path}/recent-logins`,
      this.controller.getRecentLoginActivity
    );
  }
}
