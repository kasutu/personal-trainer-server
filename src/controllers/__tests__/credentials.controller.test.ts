import request from "supertest";
import express from "express";
import { CredentialsController } from "../credentials.controller";
import { CredentialsService } from "../../services/auth.service";
import { createResponseDto } from "../../types/dto/response.dto";
import Container from "typedi";

// Remove jest.mock and use manual mocking for Bun
type CredentialsServiceMock = jest.Mocked<CredentialsService>;

const app = express();
app.use(express.json());

// Register controller routes manually for test
const controller = new CredentialsController();
app.get("/member/:id", controller.getMemberCredentialsById.bind(controller));
app.get(
  "/member/by-member/:memberId",
  controller.getMemberCredentialsByMemberId.bind(controller)
);
app.get(
  "/member/by-email/:email",
  controller.getMemberCredentialsByEmail.bind(controller)
);
app.post("/member", controller.createMemberCredentials.bind(controller));
app.put("/member/:id", async (req, res, next) => {
  if (req.body.password) {
    req.body.hashedPassword = "hashed";
    delete req.body.password;
  }
  await controller.updateMemberCredentials(req, res, next);
});
app.delete("/member/:id", controller.deleteMemberCredentials.bind(controller));
// ...repeat for instructor and admin as needed

// Helper for async mocks compatible with Bun
function createAsyncMock() {
  let impl = () => Promise.resolve(undefined);
  const fn: any = () => impl();
  fn.mockResolvedValue = (val: any) => {
    impl = () => Promise.resolve(val);
  };
  fn.mockRejectedValue = (err: any) => {
    impl = () => Promise.reject(err);
  };
  return fn;
}

describe("CredentialsController", () => {
  let serviceMock: CredentialsServiceMock;

  beforeEach(() => {
    serviceMock = {
      getMemberCredentialsById: createAsyncMock(),
      getMemberCredentialsByMemberId: createAsyncMock(),
      getMemberCredentialsByEmail: createAsyncMock(),
      createMemberCredentials: createAsyncMock(),
      updateMemberCredentials: createAsyncMock(),
      deleteMemberCredentials: createAsyncMock(),
      // Add other methods as needed
    } as unknown as CredentialsServiceMock;
    (Container.get as any) = () => serviceMock;
  });

  describe("getMemberCredentialsById", () => {
    it("should return credentials for valid id (happy path)", async () => {
      serviceMock.getMemberCredentialsById.mockResolvedValue({
        id: 1,
        email: "john@example.com",
        hashedPassword: "hashed",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).get("/member/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        createResponseDto({
          id: 1,
          email: "john@example.com",
          hashedPassword: "hashed",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.getMemberCredentialsById.mockRejectedValue(
        new Error("Not found")
      );
      const res = await request(app).get("/member/999");
      expect(res.status).toBe(500); // Express default error handler
    });
  });

  describe("getMemberCredentialsByMemberId", () => {
    it("should return credentials for valid memberId (happy path)", async () => {
      serviceMock.getMemberCredentialsByMemberId.mockResolvedValue({
        id: 2,
        email: "jane@example.com",
        hashedPassword: "hashed2",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).get("/member/by-member/2");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        createResponseDto({
          id: 2,
          email: "jane@example.com",
          hashedPassword: "hashed2",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.getMemberCredentialsByMemberId.mockRejectedValue(
        new Error("Not found")
      );
      const res = await request(app).get("/member/by-member/999");
      expect(res.status).toBe(500);
    });
  });

  describe("getMemberCredentialsByEmail", () => {
    it("should return credentials for valid email (happy path)", async () => {
      serviceMock.getMemberCredentialsByEmail.mockResolvedValue({
        id: 3,
        email: "bob@example.com",
        hashedPassword: "hashed3",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        member: {
          id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          memberAccountCredentialsId: 3,
          firstName: "Bob",
          middleName: null,
          lastName: "Smith",
          gender: "M",
          birthDate: "1990-01-01",
          phone: "1234567890",
          address: "123 Main St",
          status: "active",
          monthOfApplication: "2025-07",
        },
      } as any);
      const res = await request(app).get("/member/by-email/bob@example.com");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        createResponseDto({
          id: 3,
          email: "bob@example.com",
          hashedPassword: "hashed3",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          member: expect.objectContaining({
            id: 10,
            firstName: "Bob",
            lastName: "Smith",
            gender: "M",
            birthDate: "1990-01-01",
            phone: "1234567890",
            address: "123 Main St",
            status: "active",
            monthOfApplication: "2025-07",
          }),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.getMemberCredentialsByEmail.mockRejectedValue(
        new Error("Not found")
      );
      const res = await request(app).get(
        "/member/by-email/unknown@example.com"
      );
      expect(res.status).toBe(500);
    });
  });

  describe("createMemberCredentials", () => {
    it("should create credentials (happy path)", async () => {
      const reqBody = { email: "new@example.com", password: "pass123" };
      serviceMock.createMemberCredentials.mockResolvedValue({
        id: 4,
        email: "new@example.com",
        hashedPassword: "hashed4",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).post("/member").send(reqBody);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        createResponseDto({
          id: 4,
          email: "new@example.com",
          hashedPassword: "hashed4",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.createMemberCredentials.mockRejectedValue(
        new Error("Create failed")
      );
      const res = await request(app)
        .post("/member")
        .send({ email: "fail@example.com", password: "fail" });
      expect(res.status).toBe(500);
    });
  });

  describe("updateMemberCredentials", () => {
    it("should update credentials (happy path)", async () => {
      const reqBody = { email: "updated@example.com", password: "newpass" };
      serviceMock.updateMemberCredentials.mockResolvedValue({
        id: 5,
        email: "updated@example.com",
        hashedPassword: "hashed5",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).put("/member/5").send(reqBody);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        createResponseDto({
          id: 5,
          email: "updated@example.com",
          hashedPassword: "hashed5",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.updateMemberCredentials.mockRejectedValue(
        new Error("Update failed")
      );
      const res = await request(app)
        .put("/member/999")
        .send({ email: "fail", password: "fail" });
      expect(res.status).toBe(500);
    });
  });

  describe("deleteMemberCredentials", () => {
    it("should delete credentials (happy path)", async () => {
      serviceMock.deleteMemberCredentials.mockResolvedValue({
        id: 6,
        email: "delete@example.com",
        hashedPassword: "hashed6",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).delete("/member/6");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        createResponseDto({
          id: 6,
          email: "delete@example.com",
          hashedPassword: "hashed6",
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    it("should call next(error) on service error (sad path)", async () => {
      serviceMock.deleteMemberCredentials.mockRejectedValue(
        new Error("Delete failed")
      );
      const res = await request(app).delete("/member/999");
      expect(res.status).toBe(500);
    });
  });

  // Add similar tests for instructor and admin endpoints if implemented
});
