import { POST } from "@/app/api/lesson/designTopics/route";
import { NextResponse } from "next/server";

const _origNextResponseJson = NextResponse.json;

NextResponse.json = (body: any, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), { status: init?.status ?? 200 });
};

async function parseNextResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

jest.mock("@/lib/authentication", () => ({
  getAuthSession: jest.fn(),
}));

jest.mock("@/lib/membership", () => jest.fn());

jest.mock("@/lib/openai", () => ({
  strict_output: jest.fn(),
}));

jest.mock("@/lib/unsplash", () => ({
  getUnsplashImage: jest.fn(),
}));

jest.mock("@/lib/database", () => ({
  databaseClient: {
    lesson: { create: jest.fn() },
    module: { create: jest.fn() },
    topic: { createMany: jest.fn() },
    user: { update: jest.fn() },
  },
}));

import { getAuthSession } from "@/lib/authentication";
import verifyMembership from "@/lib/membership";
import { strict_output } from "@/lib/openai";
import { getUnsplashImage } from "@/lib/unsplash";
import { databaseClient } from "@/lib/database";

describe("Lesson Creation API POST route", () => {
  afterAll(() => {
    NextResponse.json = _origNextResponseJson;
  });

  function createRequest(body: object) {
    return new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  const mockSession = {
    user: {
      id: "user123",
      points: 10,
      isAdmin: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthSession as jest.Mock).mockResolvedValue(mockSession);
    (verifyMembership as jest.Mock).mockResolvedValue(false);
  });

  it("should return 401 if user is not logged in", async () => {
    (getAuthSession as jest.Mock).mockResolvedValue(null);

    const req = createRequest({ name: "Test", modules: ["Mod 1"] });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 402 if user has no points and no power membership", async () => {
    (getAuthSession as jest.Mock).mockResolvedValue({
      user: { ...mockSession.user, points: 0 },
    });
    (verifyMembership as jest.Mock).mockResolvedValue(false);

    const req = createRequest({ name: "Test", modules: ["Mod 1"] });
    const res = await POST(req);
    expect(res.status).toBe(402);
  });

  it("should return 400 if body is invalid", async () => {
    const req = createRequest({ invalid: "data" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should create a lesson with modules and topics", async () => {
    const mockModules = [
      {
        name: "Module A",
        topics: [
          { topicName: "Topic 1", ytSearchQuery: "Topic 1 video" },
          { topicName: "Topic 2", ytSearchQuery: "Topic 2 video" },
        ],
      },
    ];

    (strict_output as jest.Mock)
      .mockResolvedValueOnce(mockModules)
      .mockResolvedValueOnce({ image_query: "lesson image" });

    (getUnsplashImage as jest.Mock).mockResolvedValue("image_url");

    (databaseClient.lesson.create as jest.Mock).mockResolvedValue({
      id: "lesson-id",
    });

    (databaseClient.module.create as jest.Mock).mockResolvedValue({
      id: "module-id",
    });

    const req = createRequest({ name: "Cool Lesson", modules: ["Mod 1"] });
    const res = await POST(req);

    expect(res.status).toBe(200);

    const json = await parseNextResponse(res as unknown as Response);
    expect(json).toEqual({ lessonId: "lesson-id" });

    expect(databaseClient.lesson.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lessonName: "Cool Lesson",
          picture: "image_url",
        }),
      })
    );

    expect(databaseClient.module.create).toHaveBeenCalled();
    expect(databaseClient.topic.createMany).toHaveBeenCalled();
    expect(databaseClient.user.update).toHaveBeenCalledWith({
      where: { id: mockSession.user.id },
      data: { points: { decrement: 2 } },
    });
  });

  it("should return 500 if any error occurs", async () => {
    (getAuthSession as jest.Mock).mockRejectedValue(new Error("Something went wrong"));

    const req = createRequest({ name: "Error", modules: ["Mod"] });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
