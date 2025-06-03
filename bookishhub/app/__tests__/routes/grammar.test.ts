import { POST } from "@/app/api/language/route";
import { NextResponse } from "next/server";

jest.mock("@/lib/authentication", () => ({
  getAuthSession: jest.fn(),
}));

jest.mock("@/lib/membership", () => jest.fn());

jest.mock("@/lib/openai", () => ({
  strict_output: jest.fn(),
}));

jest.mock("@/lib/database", () => ({
  databaseClient: {
    language: {
      findUnique: jest.fn(),
    },
    languageSession: {
      create: jest.fn(),
    },
    grammarQuestion: {
      createMany: jest.fn(),
    },
  },
}));

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

import { getAuthSession } from "@/lib/authentication";
import verifyMembership from "@/lib/membership";
import { strict_output } from "@/lib/openai";
import { databaseClient } from "@/lib/database";

describe("Language Assessment POST API", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  function createRequest(body: object) {
    return new Request("http://localhost/api/language", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const mockSession = {
    user: {
      id: "user-id",
      points: 3,
      isAdmin: false,
    },
  };

  const requestBody = {
    languageId: "1",
    level: "Beginner",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthSession as jest.Mock).mockResolvedValue(mockSession);
    (verifyMembership as jest.Mock).mockResolvedValue(false);
  });

  it("should return 402 if user has no points and no power account", async () => {
    (getAuthSession as jest.Mock).mockResolvedValue({
      user: { ...mockSession.user, points: 0 },
    });
    (verifyMembership as jest.Mock).mockResolvedValue(false);

    const req = createRequest(requestBody);
    const res = await POST(req);

    expect(res.status).toBe(402);
    const text = await res.text();
    expect(text).toBe("You have no more points to use for a new language assessment!");
  });

  it("should return 400 if body is invalid", async () => {
    const req = createRequest({ wrong: "data" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe("Incorrect body format");
  });

  it("should return 200 and create session and questions", async () => {
    const mockQuestions = [
      {
        question: "What's the correct verb?",
        answer: "is",
        choice1: "are",
        choice2: "am",
        choice3: "be",
        choice4: "was",
      },
      {
        question: "Select the noun",
        answer: "dog",
        choice1: "run",
        choice2: "quick",
        choice3: "jump",
        choice4: "fast",
      },
      {
        question: "What is an adjective?",
        answer: "beautiful",
        choice1: "run",
        choice2: "cat",
        choice3: "is",
        choice4: "quickly",
      },
      {
        question: "Which is past tense?",
        answer: "ran",
        choice1: "run",
        choice2: "runs",
        choice3: "running",
        choice4: "jog",
      },
      {
        question: "What is a pronoun?",
        answer: "they",
        choice1: "car",
        choice2: "fast",
        choice3: "run",
        choice4: "drive",
      },
    ];

    (databaseClient.language.findUnique as jest.Mock).mockResolvedValue({
      name: "English",
    });

    (strict_output as jest.Mock).mockResolvedValue(mockQuestions);

    (databaseClient.languageSession.create as jest.Mock).mockResolvedValue({
      id: "session-id",
    });

    const req = createRequest(requestBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await parseNextResponse(res as unknown as Response);

    expect(json).toEqual({ sessionId: "session-id" });

    expect(databaseClient.language.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { name: true },
    });

    expect(strict_output).toHaveBeenCalled();
    expect(databaseClient.grammarQuestion.createMany).toHaveBeenCalled();
    expect(databaseClient.languageSession.create).toHaveBeenCalledWith({
      data: {
        languageId: 1,
        level: "Beginner",
        userId: "user-id",
      },
    });
  });

  it("should return 500 if unexpected error occurs", async () => {
    (getAuthSession as jest.Mock).mockRejectedValue(new Error("Boom"));

    const req = createRequest(requestBody);
    const res = await POST(req);

    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toBe("Internal server error");
  });
});
