import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

async function ChatContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <ChatClient />;
}

function ChatFallback() {
  return (
    <div className="flex h-[70vh] items-center justify-center text-sm text-gray-400">
      Loading chat...
    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#090812] p-4 text-white sm:p-6">
      <h1 className="mb-4 text-2xl font-semibold">ViChat</h1>
      <Suspense fallback={<ChatFallback />}>
        <ChatContent />
      </Suspense>
    </div>
  );
}