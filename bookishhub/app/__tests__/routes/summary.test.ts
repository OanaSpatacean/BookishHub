import { POST } from "@/app/api/summary_of_pdf/route";
import { databaseClient } from "@/lib/database";
import { strict_output } from "@/lib/openai";
import { NextResponse } from "next/server";

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

jest.mock("@/lib/database", () => ({
  databaseClient: {
    files: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/openai", () => ({
  strict_output: jest.fn(),
}));

const createRequest = (body: any) =>
  new Request("http://localhost/api/summary_of_pdf", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

describe("PDF Summary API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate and store a new summary if not already present", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue({
      fileKey: "This is the full PDF content.",
      summary: null,
    });

    (strict_output as jest.Mock).mockResolvedValue({
      summary: "This is a generated summary",
    });

    const req = createRequest({ fileId: "123" });
    const res = await POST(req);
    const data =  await parseNextResponse(res as unknown as Response);

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.summary).toBe("This is a generated summary");

    expect(databaseClient.files.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: { summary: "This is a generated summary" },
    });
  });

  it("should return existing summary if already present", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue({
      fileKey: "Some PDF content",
      summary: "Existing summary here.",
    });

    const req = createRequest({ fileId: "321" });
    const res = await POST(req);
    const data = await parseNextResponse(res as unknown as Response);

    expect(res.status).toBe(200);
    expect(data.message).toBe("Summary already exists");
    expect(data.summary).toBe("Existing summary here.");
    expect(strict_output).not.toHaveBeenCalled();
  });

  it("should return 400 if request body is invalid", async () => {
    const req = createRequest({});
    const res = await POST(req);
    const data = await parseNextResponse(res as unknown as Response);

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details).toBeDefined();
  });

  it("should return 404 if file is not found or fileKey missing", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockResolvedValue(null);

    const req = createRequest({ fileId: "555" });
    const res = await POST(req);
    const data = await parseNextResponse(res as unknown as Response);

    expect(res.status).toBe(404);
    expect(data.error).toBe("File not found or missing fileKey");
  });

  it("should return 500 on unexpected server error", async () => {
    (databaseClient.files.findUnique as jest.Mock).mockRejectedValue(new Error("Boom"));

    const req = createRequest({ fileId: "666" });
    const res = await POST(req);
    const data = await parseNextResponse(res as unknown as Response);

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
