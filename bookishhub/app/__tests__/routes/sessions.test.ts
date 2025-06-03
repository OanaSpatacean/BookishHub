import { DELETE } from "@/app/api/admin/edit_assessments/sessions/route"; 
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
      languageSession: {
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      grammarQuestion: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      rephrasingQuestion: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      textWriting: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      pronunciationWord: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      listeningExercise: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      readingQuestion: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      readingText: {
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
    },
  };
});

describe("DELETE /api/admin/edit_assessments/lsessions", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  const sessionId = 123;

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

  it("should return 400 if no id provided", async () => {
    const request = createRequest({});
    const response = await DELETE(request as any);
    expect(response.status).toBe(400);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ error: "Session ID is required" });
  });

  it("should return 400 if id is invalid (not a number)", async () => {
    const request = createRequest({ id: "abc" });
    const response = await DELETE(request as any);
    expect(response.status).toBe(400);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ error: "Invalid session ID" });
  });

  it("should return 404 if session not found", async () => {
    (databaseClient.languageSession.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createRequest({ id: sessionId });
    const response = await DELETE(request as any);
    expect(response.status).toBe(404);

    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ error: "Session not found" });
    expect(databaseClient.languageSession.findUnique).toHaveBeenCalledWith({ where: { id: sessionId } });
  });

  it("should delete related data and then delete session", async () => {
    (databaseClient.languageSession.findUnique as jest.Mock).mockResolvedValue({ id: sessionId });

    const models = [
      databaseClient.grammarQuestion,
      databaseClient.rephrasingQuestion,
      databaseClient.textWriting,
      databaseClient.pronunciationWord,
      databaseClient.listeningExercise,
      databaseClient.readingQuestion,
      databaseClient.readingText,
    ];

    for (const model of models) {
      (model.count as jest.Mock).mockResolvedValue(1);
      (model.deleteMany as jest.Mock).mockResolvedValue(undefined);
    }

    (databaseClient.languageSession.delete as jest.Mock).mockResolvedValue({});

    const request = createRequest({ id: sessionId });
    const response = await DELETE(request as any);

    expect(response.status).toBe(200);
    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ message: "Session deleted successfully" });

    expect(databaseClient.languageSession.findUnique).toHaveBeenCalledWith({ where: { id: sessionId } });

    for (const model of models) {
      expect(model.count).toHaveBeenCalledWith({ where: { sessionId } });
      expect(model.deleteMany).toHaveBeenCalledWith({ where: { sessionId } });
    }

    expect(databaseClient.languageSession.delete).toHaveBeenCalledWith({ where: { id: sessionId } });
  });

  it("should skip deleteMany if count is 0 for that model", async () => {
    (databaseClient.languageSession.findUnique as jest.Mock).mockResolvedValue({ id: sessionId });

    databaseClient.grammarQuestion.count.mockResolvedValue(1);
    databaseClient.grammarQuestion.deleteMany.mockResolvedValue(undefined);

    const otherModels = [
      databaseClient.rephrasingQuestion,
      databaseClient.textWriting,
      databaseClient.pronunciationWord,
      databaseClient.listeningExercise,
      databaseClient.readingQuestion,
      databaseClient.readingText,
    ];

    for (const model of otherModels) {
      (model.count as jest.Mock).mockResolvedValue(0);
      (model.deleteMany as jest.Mock).mockResolvedValue(undefined);
    }

    (databaseClient.languageSession.delete as jest.Mock).mockResolvedValue({});

    const request = createRequest({ id: sessionId });
    const response = await DELETE(request as any);

    expect(response.status).toBe(200);

    expect(databaseClient.grammarQuestion.deleteMany).toHaveBeenCalled();
    for (const model of otherModels) {
      expect(model.deleteMany).not.toHaveBeenCalled();
    }
  });

  it("should return 500 on unexpected error", async () => {
    (databaseClient.languageSession.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));

    const request = createRequest({ id: sessionId });
    const response = await DELETE(request as any);

    expect(response.status).toBe(500);
    const json = await parseNextResponse(response as unknown as Response);
    expect(json).toEqual({ error: "Internal Server Error" });
  });
});
