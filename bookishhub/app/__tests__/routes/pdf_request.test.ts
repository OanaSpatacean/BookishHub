import { DELETE, PATCH } from "@/app/api/admin/edit_PDF_request/route"; 
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
      pDFRequest: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

describe("PDFRequest API route", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  function createRequest(method: "DELETE" | "PATCH", body: object) {
    return new Request("http://localhost", {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  describe("DELETE handler", () => {
    const PDFRequestId = 123;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 400 if body is invalid", async () => {
      const request = createRequest("DELETE", { wrongKey: 1 });
      const response = await DELETE(request);
      expect(response.status).toBe(400);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({ success: false, error: "Invalid request format" });
    });

    it("should return 404 if PDFRequest does not exist", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createRequest("DELETE", { PDFRequestId });
      const response = await DELETE(request);

      expect(response.status).toBe(404);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({ success: false, error: "File request does not exist!" });
    });

    it("should delete PDFRequest successfully", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockResolvedValue({ id: PDFRequestId });
      (databaseClient.pDFRequest.delete as jest.Mock).mockResolvedValue({});

      const request = createRequest("DELETE", { PDFRequestId });
      const response = await DELETE(request);

      expect(response.status).toBe(200);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({
        success: true,
        message: "File request deleted successfully",
      });

      expect(databaseClient.pDFRequest.delete).toHaveBeenCalledWith({ where: { id: PDFRequestId } });
    });

    it("should return 500 on unexpected error", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));

      const request = createRequest("DELETE", { PDFRequestId });
      const response = await DELETE(request);

      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).toBe("Internal server error");
    });
  });

  describe("PATCH handler", () => {
    const PDFRequestId = 123;
    const content = "Updated content";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 400 if body is invalid", async () => {
      const request = createRequest("PATCH", { PDFRequestId, content: "" });
      const response = await PATCH(request);

      expect(response.status).toBe(400);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({ success: false, error: "Invalid request format" });
    });

    it("should return 404 if PDFRequest does not exist", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createRequest("PATCH", { PDFRequestId, content });
      const response = await PATCH(request);

      expect(response.status).toBe(404);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({ success: false, error: "File request does not exist!" });
    });

    it("should update PDFRequest content successfully", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockResolvedValue({ id: PDFRequestId });
      (databaseClient.pDFRequest.update as jest.Mock).mockResolvedValue({});

      const request = createRequest("PATCH", { PDFRequestId, content });
      const response = await PATCH(request);

      expect(response.status).toBe(200);

      const json = await parseNextResponse(response as unknown as Response);
      expect(json).toEqual({
        success: true,
        message: "File request content updated successfully",
      });

      expect(databaseClient.pDFRequest.update).toHaveBeenCalledWith({
        where: { id: PDFRequestId },
        data: { content },
      });
    });

    it("should return 500 on unexpected error", async () => {
      (databaseClient.pDFRequest.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));

      const request = createRequest("PATCH", { PDFRequestId, content });
      const response = await PATCH(request);

      expect(response.status).toBe(500);

      const text = await response.text();
      expect(text).toBe("Internal server error");
    });
  });
});
