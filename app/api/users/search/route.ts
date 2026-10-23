import { auth, clerkClient } from "@clerk/nextjs/server";
import { connection, NextResponse } from "next/server";

export async function GET(request: Request) {
  await connection();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const clerk = await clerkClient();

    const result = await clerk.users.getUserList({
      query,
      limit: 10,
    });

    const users = result.data
      .filter((user) => user.id !== userId)
      .map((user) => ({
        id: user.id,
        name:
          [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") || "User",
        username: user.username,
        imageUrl: user.imageUrl,
      }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("User search failed:", error);

    return NextResponse.json(
      { error: "Unable to search users" },
      { status: 500 }
    );
  }
}