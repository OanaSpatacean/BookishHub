import { POST, PUT, DELETE, GET } from "@/app/api/admin/edit_assessments/languages/route";
import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";

const _origNextResponseJson = NextResponse.json;

NextResponse.json = (body: any, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), { status: init?.status ?? 200, headers: init?.headers });
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
      language: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };
});

describe("Language API route", () => {
  beforeAll(() => {
  });

  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  describe("POST /api/language", () => {
    it("should create a language", async () => {
      const mockLanguage = { id: 1, name: "English" };
      (databaseClient.language.create as jest.Mock).mockResolvedValue(mockLanguage);

      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ name: "English" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const json = await parseNextResponse(response as unknown as Response);

      expect(response.status).toBe(200);
      expect(json).toEqual({ success: true, language: mockLanguage });
    });

    it("should return 400 if body is invalid", async () => {
      const request = new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({}), // missing "name"
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/language", () => {
    it("should update a language", async () => {
      const mockLanguage = { id: 1, name: "French" };
      (databaseClient.language.update as jest.Mock).mockResolvedValue(mockLanguage);

      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ id: 1, name: "French" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request);
      const json = await parseNextResponse(response as unknown as Response);

      expect(response.status).toBe(200);
      expect(json).toEqual({ success: true, language: mockLanguage });
    });

    it("should return 400 if body is invalid", async () => {
      const request = new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ name: "NoID" }), // missing "id"
        headers: { "Content-Type": "application/json" },
      });

      const response = await PUT(request);
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/language", () => {
    it("should delete a language", async () => {
      (databaseClient.language.delete as jest.Mock).mockResolvedValue({});

      const request = new Request("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await DELETE(request);
      const json = await parseNextResponse(response as unknown as Response);

      expect(response.status).toBe(200);
      expect(json).toEqual({ success: true, message: "Language deleted successfully" });
    });

    it("should return 400 if body is invalid", async () => {
      const request = new Request("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({}), // missing "id"
        headers: { "Content-Type": "application/json" },
      });

      const response = await DELETE(request);
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/language", () => {
    it("should fetch languages", async () => {
      const mockLanguages = [{ id: 1, name: "English" }];
      (databaseClient.language.findMany as jest.Mock).mockResolvedValue(mockLanguages);

      const response = await GET();
      const json = await parseNextResponse(response as unknown as Response);

      expect(response.status).toBe(200);
      expect(json).toEqual({ success: true, languages: mockLanguages });
    });

    it("should return 500 if findMany throws", async () => {
      (databaseClient.language.findMany as jest.Mock).mockRejectedValue(new Error("Oops"));
      const response = await GET();
      expect(response.status).toBe(500);
    });
  });
});
