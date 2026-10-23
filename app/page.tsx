
import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Suspense } from "react";

const features = [
  {
    icon: "✦",
    title: "Real-time messaging",
    description:
      "Conversations that flow naturally. Send messages and stay connected without the wait.",
    color: "from-violet-500/20 to-indigo-500/10",
  },
  {
    icon: "↗",
    title: "Share more, effortlessly",
    description:
      "Keep your conversations together and make every interaction feel effortless.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
];

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.5L14.8 9.2L21.5 12L14.8 14.8L12 21.5L9.2 14.8L2.5 12L9.2 9.2L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CTAFallback({ light = false }: { light?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`h-[54px] w-[240px] animate-pulse rounded-2xl ${
        light ? "bg-white/80" : "bg-violet-600/40"
      }`}
    />
  );
}

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[490px]">
      <div className="absolute -inset-8 rounded-full bg-violet-600/20 blur-[90px]" />

      <div className="absolute -right-2 top-8 z-20 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#19172a]/95 p-3 shadow-2xl sm:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
          ✓
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Message delivered</p>
          <p className="mt-1 text-[11px] text-gray-400">
            Your moment, instantly shared.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#11101c]/95 shadow-[0_30px_100px_-30px_rgba(124,58,237,0.4)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white">
              V
            </div>
            <div>
              <p className="font-semibold text-white">ViChat</p>
              <p className="text-xs text-gray-500">Your space to connect</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-pink-500 text-sm font-bold text-white">
              A
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#11101c] bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Alex Morgan</p>
              <p className="text-xs text-emerald-400">Online now</p>
            </div>
          </div>
          <div className="flex gap-3 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M15 10L20 6V18L15 14M4 7H15V17H4C3.4 17 3 16.6 3 16V8C3 7.4 3.4 7 4 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-6 px-5 py-7 sm:px-7">
          <div className="text-center">
            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[10px] tracking-wide text-gray-500">
              TODAY · 10:42 AM
            </span>
          </div>

          <div className="flex items-end gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-pink-500 text-[10px] font-bold text-white">
              A
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.05] px-4 py-3">
              <p className="text-sm leading-6 text-gray-200">
                Hey! Have you checked out the new ViChat experience? 👀
              </p>
              <p className="mt-1.5 text-right text-[10px] text-gray-500">
                10:42 AM
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[83%] rounded-2xl rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-3 shadow-lg shadow-violet-900/20">
              <p className="text-sm leading-6 text-white">
                Just did! The interface is so clean. Love how everything feels
                connected. ✨
              </p>
              <div className="mt-2 flex items-center justify-end gap-1.5">
                <span className="text-[10px] text-violet-200">10:43 AM</span>
                <svg viewBox="0 0 20 12" fill="none" className="h-3 w-5 text-cyan-200">
                  <path
                    d="M1 6L5 10L12 2M8 6L12 10L19 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-pink-500 text-[10px] font-bold text-white">
              A
            </div>
            <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.05] px-4 py-3">
              <p className="text-sm text-gray-200">
                Right?! And we’re just getting started 🚀
              </p>
              <p className="mt-1.5 text-right text-[10px] text-gray-500">
                10:43 AM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2.5 pl-4">
            <span className="flex-1 text-sm text-gray-500">
              Type your message...
            </span>
            <button
              type="button"
              aria-label="Example send button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Sparkle className="absolute -left-5 top-1/3 hidden h-9 w-9 text-violet-300 sm:block" />
      <Sparkle className="absolute -bottom-5 right-10 h-7 w-7 text-indigo-300" />
    </div>
  );
}

function ChatCTA() {
  return (
    <>
      <Show when="signed-in">
        <Link
          href="/chat"
          className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5"
        >
          Start chatting for free →
        </Link>
      </Show>

      <Show when="signed-out">
        <SignUpButton forceRedirectUrl="/chat">
          <button
            type="button"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5"
          >
            Start chatting for free →
          </button>
        </SignUpButton>
      </Show>
    </>
  );
}
function AccountCTA() {
  return (
    <>
      <Show when="signed-in">
        <Link
          href="/chat"
          className="rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-gray-950 transition hover:bg-violet-100"
        >
          Open ViChat →
        </Link>
      </Show>

      <Show when="signed-out">
        <SignUpButton forceRedirectUrl="/chat">
          <button
            type="button"
            className="rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-gray-950 transition hover:bg-violet-100"
          >
            Create your account →
          </button>
        </SignUpButton>
      </Show>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090812] text-white">
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-32 h-[450px] w-[450px] rounded-full bg-violet-700/20 blur-[130px]" />
          <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-14 sm:pt-20 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:mx-0">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
              <span className="text-xs font-medium tracking-wide text-violet-200 sm:text-sm">
                A new way to stay connected
              </span>
              <span className="text-violet-300">✦</span>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[76px]">
              Good things
              <br />
              happen when
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                we connect.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-400 sm:text-lg">
              Meet ViChat, your space for conversations that matter. Bring your
              <br />
              people closer with a simpler, more delightful way to chat.
            
              Created by{" "}
              <a
                href="https://www.youtube.com/@the_creative_coder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 hover:underline"
              >
                Pranjal Vidyarthi (The Creative Coder)
              </a>
            
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Suspense fallback={<CTAFallback />}>
              <ChatCTA />
            </Suspense>

              <Link
                href="#experience"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.07]"
              >
                Explore ViChat <span>↓</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Easy to get started
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Designed for connection
              </span>
            </div>
          </div>

          <div id="experience" className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <ChatPreview />
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      <section id="features" className="relative px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
              Made for your moments
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Less friction.
              <span className="text-gray-500"> More connection.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-400">
              The little things make a big difference. ViChat keeps the
              experience focused on what matters: your conversations.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.04] sm:p-8"
              >
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.color} opacity-40 transition group-hover:opacity-100`}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl text-violet-300">
                  {feature.icon}
                </div>
                <p className="mt-8 text-xs font-medium text-gray-500">
                  0{index + 1} / FEATURE
                </p>
                <h3 className="mt-3 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {feature.description}
                </p>
                <div className="mt-7 flex items-center gap-2 text-sm font-medium text-violet-300">
                  Built for better conversations <span aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 pb-24 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-violet-400/20 bg-[#151125] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-violet-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-10 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />

          <Sparkle className="relative mx-auto h-10 w-10 text-violet-300" />
          <h2 className="relative mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next great conversation starts here.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Make room for more moments, more ideas, and more meaningful
            conversations. Join ViChat and stay closer to your people.
          </p>
          <div className="relative mt-8">
            <Suspense fallback={<CTAFallback light />}>
            <AccountCTA />
          </Suspense>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkle className="h-5 w-5" />
            </span>
            ViChat
          </Link>
          <p className="text-center text-xs text-gray-500">
            A little closer, one conversation at a time.
          </p>
          <span className="text-xs text-gray-500">
              © 2026 ViChat · Created by{" "}
              <a
                href="https://www.youtube.com/@the_creative_coder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-300 hover:underline"
              >
                Pranjal Vidyarthi (The Creative Coder)
              </a>
            </span>

          <span className="text-xs text-gray-600">Email : pranjalvidyarthiwork@gmail.com</span>
          <span className="text-xs text-gray-600">Github : <a href="https://www.github.com/pranjalvidyarthi" target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:underline">pranjalvidyarthi</a></span>
        </div>
      </footer>
    </div>
  );
}
