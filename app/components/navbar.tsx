
"use client";

import Link from "next/link";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";



function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
<header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090812]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30">
            <Sparkle className="h-6 w-6 text-white" />
          </span>

          <span className="text-xl font-bold tracking-tight text-white">
            Vi<span className="text-violet-400">Chat</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/#experience"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Experience
          </Link>
          <Link
            href="/#about"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-violet-100"
              >
                Get started ↗
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
