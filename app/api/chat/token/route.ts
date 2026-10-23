import { auth } from "@clerk/nextjs/server";
import { connection, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET() {
  await connection();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("Stream API environment variables are missing.");

      return NextResponse.json(
        { error: "Stream server configuration is missing." },
        { status: 500 }
      );
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken(userId);

    return NextResponse.json({
      token,
      userId,
      apiKey,
    });
  } catch (error) {
    console.error("Stream token generation failed:", error);

    return NextResponse.json(
      { error: "Unable to generate chat token." },
      { status: 500 }
    );
  }
}