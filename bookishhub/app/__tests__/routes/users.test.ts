import { POST, PUT, DELETE } from "@/app/api/admin/edit_users/route";
import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";

const _origNextResponseJson = NextResponse.json;

NextResponse.json = (body: any, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: init?.headers,
  });
};

async function parseNextResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

jest.mock("@/lib/database", () => {
  const actual = jest.requireActual("@/lib/database");
  return {
    ...actual,
    databaseClient: {
      user: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

describe("User API Routes", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  function createRequest(method: string, body: object) {
    return new Request("http://localhost", {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = "user-id-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/admin/edit_users", () => {
    it("should return 400 for invalid body", async () => {
      const request = createRequest("POST", { email: "not-an-email" });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe("Invalid request body format");
    });

    it("should create user and return id/email", async () => {
      (databaseClient.user.create as jest.Mock).mockResolvedValue({
        id: userId,
        email: "test@example.com",
      });

      const request = createRequest("POST", {
        email: "test@example.com",
        password: "secret",
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const json = await parseNextResponse(response);
      expect(json).toEqual({
        success: true,
        user: { id: userId, email: "test@example.com" },
      });

      expect(databaseClient.user.create).toHaveBeenCalled();
    });

    it("should return 500 on DB error", async () => {
      (databaseClient.user.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      const request = createRequest("POST", {
        email: "test@example.com",
        password: "secret",
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toBe("Internal server error");
    });
  });

  describe("PUT /api/admin/edit_users", () => {
    it("should return 400 for invalid body", async () => {
      const request = createRequest("PUT", { name: "no-id" });
      const response = await PUT(request);

      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe("Invalid request body format");
    });

    it("should update user and return data", async () => {
      const updatedUser = {
        id: userId,
        name: "Updated",
        points: 30,
        isAdmin: false,
      };

      (databaseClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const request = createRequest("PUT", {
        id: userId,
        name: "Updated",
        points: 30,
        isAdmin: false,
      });

      const response = await PUT(request);
      expect(response.status).toBe(200);

      const json = await parseNextResponse(response);
      expect(json).toEqual({ success: true, user: updatedUser });

      expect(databaseClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: "Updated",
          points: 30,
          isAdmin: false,
        },
      });
    });

    it("should return 500 on error", async () => {
      (databaseClient.user.update as jest.Mock).mockRejectedValue(new Error("DB error"));

      const request = createRequest("PUT", {
        id: userId,
        name: "Someone",
      });

      const response = await PUT(request);
      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toBe("Internal server error");
    });
  });

  describe("DELETE /api/admin/edit_users", () => {
    it("should return 400 for invalid body", async () => {
      const request = createRequest("DELETE", { name: "no-id" });
      const response = await DELETE(request);

      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe("Invalid request body format");
    });

    it("should delete user successfully", async () => {
      (databaseClient.user.delete as jest.Mock).mockResolvedValue({});

      const request = createRequest("DELETE", { id: userId });
      const response = await DELETE(request);

      expect(response.status).toBe(200);
      const json = await parseNextResponse(response);
      expect(json).toEqual({
        success: true,
        message: "User deleted successfully",
      });

      expect(databaseClient.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it("should return 500 on delete error", async () => {
      (databaseClient.user.delete as jest.Mock).mockRejectedValue(new Error("DB error"));

      const request = createRequest("DELETE", { id: userId });
      const response = await DELETE(request);

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toBe("Internal server error");
    });
  });
});
