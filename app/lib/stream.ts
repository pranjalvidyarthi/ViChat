
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream environment variables");
}

export const streamServerClient = StreamChat.getInstance(
  apiKey,
  apiSecret
);
