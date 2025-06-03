import { DELETE } from "@/app/api/admin/edit_lessons/route";
import { databaseClient } from "@/lib/database";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

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
      lesson: {
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      query: {
        deleteMany: jest.fn(),
      },
      topic: {
        deleteMany: jest.fn(),
      },
      module: {
        deleteMany: jest.fn(),
      },
    },
  };
});

describe("DELETE /api/admin/edit_lessons", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  const lessonId = "lesson-123";

  function createRequest(body: object) {
    return new Request("http://localhost", {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if body is invalid (Zod validation error)", async () => {
    const request = createRequest({ wrongKey: "no-lessonId" });
    const response = await DELETE(request, new Response());
    expect(response.status).toBe(400);

    const text = await response.text();
    expect(text).toBe("Incorrect body format");
  });

  it("should return 404 if lesson does not exist", async () => {
    (databaseClient.lesson.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createRequest({ lessonId });
    const response = await DELETE(request, new Response());

    expect(response.status).toBe(404);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ success: false, error: "Lesson does not exist!" });
  });

  it("should delete queries, topics, modules and lesson successfully", async () => {
    const mockLesson = {
      id: lessonId,
      modules: [
        {
          id: "module1",
          topics: [
            {
              id: "topic1",
              queries: [{ id: "query1" }, { id: "query2" }],
            },
            {
              id: "topic2",
              queries: [],
            },
          ],
        },
        {
          id: "module2",
          topics: [],
        },
      ],
    };

    (databaseClient.lesson.findUnique as jest.Mock).mockResolvedValue(mockLesson);

    (databaseClient.query.deleteMany as jest.Mock).mockResolvedValue(undefined);
    (databaseClient.topic.deleteMany as jest.Mock).mockResolvedValue(undefined);
    (databaseClient.module.deleteMany as jest.Mock).mockResolvedValue(undefined);
    (databaseClient.lesson.delete as jest.Mock).mockResolvedValue(undefined);

    const request = createRequest({ lessonId });
    const response = await DELETE(request, new Response());

    expect(response.status).toBe(200);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({
      success: true,
      message: "Lesson, modules, topics and queries deleted successfully",
    });

    expect(databaseClient.query.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["query1", "query2"] } },
    });

    expect(databaseClient.topic.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["topic1", "topic2"] } },
    });

    expect(databaseClient.module.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["module1", "module2"] } },
    });

    expect(databaseClient.lesson.delete).toHaveBeenCalledWith({
      where: { id: lessonId },
    });
  });

  it("should skip deleting queries, topics, or modules if empty", async () => {
    const mockLesson = {
      id: lessonId,
      modules: [],
    };

    (databaseClient.lesson.findUnique as jest.Mock).mockResolvedValue(mockLesson);

    (databaseClient.lesson.delete as jest.Mock).mockResolvedValue(undefined);

    const request = createRequest({ lessonId });
    const response = await DELETE(request, new Response());

    expect(response.status).toBe(200);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({
      success: true,
      message: "Lesson, modules, topics and queries deleted successfully",
    });

    expect(databaseClient.query.deleteMany).not.toHaveBeenCalled();
    expect(databaseClient.topic.deleteMany).not.toHaveBeenCalled();
    expect(databaseClient.module.deleteMany).not.toHaveBeenCalled();

    expect(databaseClient.lesson.delete).toHaveBeenCalledWith({
      where: { id: lessonId },
    });
  });

  it("should return 500 on unexpected error", async () => {
    (databaseClient.lesson.findUnique as jest.Mock).mockRejectedValue(new Error("DB failure"));

    const request = createRequest({ lessonId });
    const response = await DELETE(request, new Response());

    expect(response.status).toBe(500);

    const text = await response.text();
    expect(text).toBe("Internal server error");
  });
});
