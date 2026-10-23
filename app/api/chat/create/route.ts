
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function POST(request: Request) {
  try {
    // Get the authenticated Clerk user.
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Validate the recipient.
    const body = await request.json();
    const targetUserId = body.targetUserId;

    if (
      typeof targetUserId !== "string" ||
      !targetUserId.trim() ||
      targetUserId === userId
    ) {
      return NextResponse.json(
        { error: "Invalid recipient." },
        { status: 400 }
      );
    }

    // Check Stream credentials.
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error(
        "Stream configuration is missing. Check your environment variables."
      );
    }

    // Verify the recipient exists in Clerk.
    const clerk = await clerkClient();
    const recipient = await clerk.users.getUser(targetUserId);

    // Initialize the Stream server client.
    const streamServer = StreamChat.getInstance(apiKey, apiSecret);

    // Ensure both users exist in Stream.
    await streamServer.upsertUsers([
      {
        id: userId,
      },
      {
        id: recipient.id,
        name:
          [recipient.firstName, recipient.lastName]
            .filter(Boolean)
            .join(" ") ||
          recipient.username ||
          "ViChat User",
        image: recipient.imageUrl,
      },
    ]);

    // Create the one-to-one conversation.
    const channel = streamServer.channel("messaging", {
      created_by_id: userId,
      members: [userId, targetUserId],
    });

    await channel.create();

    return NextResponse.json({
      success: true,
      channelId: channel.id,
      targetUserId,
    });
  } catch (error) {
    console.error("Direct conversation creation failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Unable to create conversation.",
      },
      { status: 500 }
    );
  }
}
