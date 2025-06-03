import { DELETE } from "@/app/api/admin/edit_pdfs/route";
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
      files: {
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      pDFRequest: {
        deleteMany: jest.fn(),
      },
    },
  };
});

describe("PDF File DELETE API route", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  function createRequest(body: object) {
    return new Request("http://localhost", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  const PDFFileId = 101;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if request body is invalid", async () => {
    const request = createRequest({ wrongKey: 5 });
    const response = await DELETE(request);

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toBe("Incorrect body format");
  });

  it("should return 404 if file does not exist", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createRequest({ PDFFileId });
    const response = await DELETE(request);

    expect(response.status).toBe(404);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ success: false, error: "File does not exist!" });
  });

  it("should delete related PDFRequests and file successfully", async () => {
    const mockPDFRequests = [{ id: 1 }, { id: 2 }];

    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue({
      id: PDFFileId,
      PDFRequests: mockPDFRequests,
    });
    (databaseClient.pDFRequest.deleteMany as jest.Mock).mockResolvedValue({});
    (databaseClient.files.delete as jest.Mock).mockResolvedValue({});

    const request = createRequest({ PDFFileId });
    const response = await DELETE(request);

    expect(response.status).toBe(200);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({
      success: true,
      message: "File and related requests deleted successfully",
    });

    expect(databaseClient.pDFRequest.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: mockPDFRequests.map((r) => r.id) } },
    });

    expect(databaseClient.files.delete).toHaveBeenCalledWith({
      where: { id: PDFFileId },
    });
  });

  it("should delete file without related PDFRequests if none exist", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue({
      id: PDFFileId,
      PDFRequests: [],
    });
    (databaseClient.files.delete as jest.Mock).mockResolvedValue({});

    const request = createRequest({ PDFFileId });
    const response = await DELETE(request);

    expect(response.status).toBe(200);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({
      success: true,
      message: "File and related requests deleted successfully",
    });

    expect(databaseClient.pDFRequest.deleteMany).not.toHaveBeenCalled();
    expect(databaseClient.files.delete).toHaveBeenCalledWith({
      where: { id: PDFFileId },
    });
  });

  it("should return 500 if unexpected error occurs", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockRejectedValue(new Error("DB failure"));

    const request = createRequest({ PDFFileId });
    const response = await DELETE(request);

    expect(response.status).toBe(500);

    const text = await response.text();
    expect(text).toBe("Internal server error");
  });
});
