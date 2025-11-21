"use client";
import React, { useEffect, useMemo, useState } from "react";

const colors = {
  plum: "#36013f",
  slate: "#37475e",
  teal: "#176161",
  gold: "#e0cd67",
  rose: "#c3b4b3",
};

const EMOJI_OPTIONS = [
  { key: "done", label: "Did it", emoji: "✅" },
  { key: "hard", label: "Felt hard but did it", emoji: "💪" },
  { key: "sprout", label: "Small progress", emoji: "🌱" },
  { key: "great", label: "Felt great", emoji: "🔥" },
  { key: "missed", label: "Missed today", emoji: "😅" },
] as const;

type EmojiKey = typeof EMOJI_OPTIONS[number]["key"];
type DayEntry = { emoji?: EmojiKey; ease?: 1 | 2 | 3 | 4 | 5 };
type TrackerState = {
  title: string;
  startDate: string;
  endDate: string;
  entries: Record<string, DayEntry>;
};

const STORAGE_KEY = "em-kaizen-1pct-tracker";

function useLocalStorage<T>(key: string, initial: T) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        setState(JSON.parse(raw) as T);
      }
    } catch (e) {
      console.error("localStorage read error:", e);
    }
    setMounted(true);
  }, [key]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.error("localStorage write error:", e);
      }
    }
  }, [key, state, mounted]);

  return [state, setState] as const;
}

function dateRange(startISO: string, endISO: string): string[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const days: string[] = [];
  for (let d = new Date(start.getFullYear(), start.getMonth(), start.getDate()); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d).toISOString().slice(0, 10));
  }
  return days;
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" });
}

export default function KaizenChallengePage() {
  const defaultStart = useMemo(() => new Date(), []);
  const defaultEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d;
  }, []);

  const [state, setState] = useLocalStorage<TrackerState>(STORAGE_KEY, {
    title: "Kaizen 1% — My Practice",
    startDate: defaultStart.toISOString().slice(0, 10),
    endDate: defaultEnd.toISOString().slice(0, 10),
    entries: {},
  });

  const days = useMemo(() => dateRange(state.startDate, state.endDate), [state.startDate, state.endDate]);

  const avgEase = useMemo(() => {
    const vals = days
      .map((d) => state.entries[d]?.ease)
      .filter((v) => v !== undefined && v !== null) as number[];
    if (!vals.length) return null;
    const sum = vals.reduce((a, b) => a + b, 0);
    return (sum / vals.length).toFixed(2);
  }, [days, state.entries]);

  const trend = useMemo(() => {
    const mid = Math.floor(days.length / 2);
    const left = days
      .slice(0, mid)
      .map((d) => state.entries[d]?.ease)
      .filter((v) => v !== undefined && v !== null) as number[];
    const right = days
      .slice(mid)
      .map((d) => state.entries[d]?.ease)
      .filter((v) => v !== undefined && v !== null) as number[];
    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const l = avg(left);
    const r = avg(right);
    if (!l && !r) return "–";
    if (r > l) return "↗︎ Getting easier";
    if (r < l) return "↘︎ Feeling tougher";
    return "→ Holding steady";
  }, [days, state.entries]);

  function updateEntry(dateISO: string, patch: Partial<DayEntry>) {
    setState((prev) => ({
      ...prev,
      entries: { ...prev.entries, [dateISO]: { ...prev.entries[dateISO], ...patch } },
    }));
  }

  function resetAll() {
    if (confirm("Reset all tracker data?")) setState((prev) => ({ ...prev, entries: {} }));
  }

  return (
    <div className="min-h-screen bg-[--em-bg] text-[--em-ink]">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-[--em-bg]/80 border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl" style={{ background: "linear-gradient(135deg, var(--em-plum), var(--em-teal))" }} />
            <div>
              <p className="text-xs uppercase tracking-widest text-[--em-muted]">Elevated Movements</p>
              <h1 className="text-xl font-bold" style={{ color: colors.plum }}>
                Kaizen 1% Challenge
              </h1>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-black/10 bg-[--em-card] hover:bg-white shadow-sm transition"
          >
            <span className="text-lg">🖨️</span>
            <span className="text-sm font-medium">Print</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8">
          <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[--em-muted] mb-2">EM Advisory Board • Internal Pilot</p>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: colors.slate }}>
                Kaizen 1% Challenge for EM Advisory Board
              </h2>
              <p className="text-lg leading-relaxed text-[--em-muted]">
                Before we introduce this to our audience, I want you to experience it firsthand—not just to test it, but to invest in
                yourselves. This is a low-stakes, high-impact way to practice what we preach: transformation doesn't require overhaul.
                It requires consistency. For the next 7 days, carve out 5 minutes a day to get 1% better. That's it.
              </p>
            </div>
            <aside className="rounded-2xl bg-gradient-to-br from-[--em-plum] to-[--em-teal] p-[2px]">
              <div className="rounded-2xl bg-[--em-card] p-5 h-full">
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.plum }}>
                  Your Next Steps
                </h3>
                <ol className="list-decimal ml-4 space-y-1 text-sm text-[--em-ink]">
                  <li>Pick your 1% action (≤ 5 minutes daily)</li>
                  <li>Drop your daily emoji in the EM Advisory thread</li>
                  <li>Track your ease rating each day (1–5)</li>
                  <li>Reflect & share a 2-minute takeaway at the October meeting</li>
                </ol>
                <div className="mt-4 p-3 rounded-xl bg-[--em-bg] text-sm">
                  <p className="mb-1">
                    <span className="font-semibold">My 1%:</span> Increasing my morning meditation from 3→5 minutes and reading the
                    daily lesson from my <em>You Are a Badass</em> calendar.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-4" style={{ color: colors.slate }}>
          How It Works (3 Simple Steps)
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-[--em-card] p-5 shadow-sm">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-2" style={{ color: colors.plum }}>
              Pick ONE Small Action
            </h4>
            <p className="text-sm text-[--em-muted] mb-3">Choose something so small you can do it even on your worst day (≤5 minutes).</p>
            <ul className="text-sm space-y-1">
              <li>• Drink water before coffee</li>
              <li>• Close your eyes for 10 seconds</li>
              <li>• Write down one win</li>
              <li>• Stretch for 2 minutes</li>
              <li>• Say "I need a minute"</li>
              <li>• Read one page</li>
              <li>• Send one appreciative text</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-black/5 bg-[--em-card] p-5 shadow-sm">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-2" style={{ color: colors.plum }}>
              Partner Up
            </h4>
            <p className="text-sm text-[--em-muted] mb-3">Accountability makes change stick. Post a daily emoji to the EM Advisory thread or DM a partner.</p>
            <div className="grid grid-cols-5 gap-2 text-center text-xl">
              {EMOJI_OPTIONS.map((e) => (
                <div
                  key={e.key}
                  className="rounded-lg border border-black/10 p-2 bg-[--em-bg]"
                  title={e.label}
                >
                  <span aria-hidden>{e.emoji}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[--em-muted] mt-2">No explanations needed. Just show up.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-[--em-card] p-5 shadow-sm">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-2" style={{ color: colors.plum }}>
              Track Ease, Not Perfection
            </h4>
            <p className="text-sm text-[--em-muted] mb-3">Each day, rate how easy it felt (1–5). Watch the trend, not the number.</p>
            <ul className="text-sm space-y-1">
              <li>1 = Very difficult</li>
              <li>3 = Neutral / manageable</li>
              <li>5 = Easy / natural</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="max-w-5xl mx-auto px-4 py-4">
        <div className="rounded-2xl border border-black/5 bg-[--em-card] p-5 shadow-sm">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.slate }}>
            The Parameters
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Duration:</strong> 7 days (starting <span className="underline">[Day 1 Date]</span> through{" "}
                  <span className="underline">[Day 7 Date]</span>)
                </li>
                <li>
                  <strong>Time commitment:</strong> ≤ 5 minutes/day
                </li>
                <li>
                  <strong>Accountability:</strong> Daily emoji check-in (thread or partner)
                </li>
                <li>
                  <strong>Tracking:</strong> Daily 1–5 ease rating (private or shared)
                </li>
                <li>
                  <strong>Reflection:</strong> Bring a 2-minute share to October's Advisory Board meeting
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: colors.plum }}>
                Reflection prompts:
              </p>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li>Did it get easier over the week?</li>
                <li>What surprised you?</li>
                <li>What got in the way?</li>
                <li>Would you continue?</li>
                <li>What did you learn about yourself?</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-[--em-rose]/40 to-[--em-gold]/30 p-[2px]">
          <div className="rounded-2xl bg-[--em-card] p-6">
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.slate }}>
              Why This Matters
            </h3>
            <p className="text-[15px] leading-relaxed text-[--em-ink]">
              This challenge is rooted in <em>Kaizen</em>, a Japanese philosophy of continuous improvement through tiny, consistent
              actions. The idea is simple: 1% better every day compounds into massive transformation over time. We're asking the EM
              community to embrace rest, clarity, and intentional growth—but we can't invite them into something we haven't experienced
              ourselves. This is your chance to practice what we'll be teaching. And honestly? You may be surprised by how much shifts
              when you give yourself permission to start small.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tracker */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-black/5 bg-[--em-card] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-2xl font-bold" style={{ color: colors.slate }}>
              7-Day Practice Tracker (Optional)
            </h3>
            <button
              onClick={resetAll}
              className="text-sm rounded-xl px-3 py-2 border border-black/10 bg-[--em-bg] hover:bg-white transition"
              title="Reset tracker"
            >
              Reset
            </button>
          </div>

          <div className="grid md:grid-cols-[1fr,1.1fr] gap-6 mt-4">
            {/* Config */}
            <div className="rounded-xl border border-black/10 p-4">
              <label className="block text-xs uppercase tracking-widest text-[--em-muted] mb-1">Title</label>
              <input
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-3 py-2 mb-3 bg-[--em-bg]"
                placeholder="My 1% — e.g., 5-minute stretch"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[--em-muted] mb-1">Start</label>
                  <input
                    type="date"
                    value={state.startDate}
                    onChange={(e) => setState({ ...state, startDate: e.target.value })}
                    className="w-full rounded-lg border border-black/10 px-3 py-2 bg-[--em-bg]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[--em-muted] mb-1">End</label>
                  <input
                    type="date"
                    value={state.endDate}
                    onChange={(e) => setState({ ...state, endDate: e.target.value })}
                    className="w-full rounded-lg border border-black/10 px-3 py-2 bg-[--em-bg]"
                  />
                </div>
              </div>
              <div className="mt-4 text-sm text-[--em-muted]">
                <p>
                  <strong>Tip:</strong> Drop a daily emoji in the EM Advisory thread. No explanations—just consistency.
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h4 className="font-semibold" style={{ color: colors.plum }}>
                  {state.title || "My 1% Practice"}
                </h4>
                <div className="text-sm text-[--em-muted]">
                  {avgEase ? (
                    <span>
                      Avg ease: <strong>{avgEase}</strong> • {trend}
                    </span>
                  ) : (
                    <span>Rate ease 1–5 to see trend</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {days.map((d) => {
                  const entry = state.entries[d] || {};
                  return (
                    <div key={d} className="rounded-lg border border-black/10 p-3 bg-[--em-bg]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{formatDisplayDate(d)}</span>
                        <select
                          value={entry.ease || ""}
                          onChange={(e) =>
                            updateEntry(d, { ease: Number(e.target.value) as DayEntry["ease"] })
                          }
                          className="text-xs rounded-md border border-black/10 px-2 py-1 bg-white"
                          aria-label={`Ease rating for ${formatDisplayDate(d)}`}
                        >
                          <option value="">Ease 1–5</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {EMOJI_OPTIONS.map((opt) => {
                          const active = entry.emoji === opt.key;
                          return (
                            <button
                              key={opt.key}
                              onClick={() =>
                                updateEntry(d, { emoji: active ? undefined : opt.key })
                              }
                              className={`text-xl rounded-md border border-black/10 p-2 transition ${
                                active ? "bg-white shadow" : "bg-[--em-card] hover:bg-white"
                              }`}
                              title={opt.label}
                              aria-label={`${opt.label} - ${formatDisplayDate(d)}`}
                            >
                              <span aria-hidden>{opt.emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-black/5 bg-[--em-card] p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.slate }}>
            Let's Do This Together
          </h3>
          <p className="max-w-3xl mx-auto text-[15px] leading-relaxed text-[--em-ink]">
            I'll be posting my emoji check-ins daily, and I hope you will too. This is low-pressure, high-support. If you miss a day,
            no problem—just come back. The win is always in returning, not in being perfect.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="#"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[--em-ink] border border-black/10 bg-gradient-to-br from-[--em-gold]/70 to-[--em-rose]/70 hover:from-[--em-gold] hover:to-[--em-rose] shadow-sm transition"
              title="Drop a ✅ in the thread when you've picked your 1% action"
            >
              Drop a ✅ in the thread
            </a>
            <button
              className="rounded-xl px-4 py-2 text-sm font-semibold border border-black/10 bg-[--em-bg] hover:bg-white transition"
              onClick={() => alert("You've got this. 1% today! ✨")}
            >
              I'm in — 1% today
            </button>
          </div>
          <div className="mt-6 text-sm text-[--em-muted]">
            <p>
              With excitement (and 1% more intention), <strong>Shria</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-[--em-muted]">
          <p>
            P.S. If you want to go deeper: <em>Sacred Rest</em> by Dr. Saundra Dalton-Smith and <em>Atomic Habits</em> by James Clear
            are great companions. For this week, all you need is 5 minutes and one small choice.
          </p>
        </div>
      </footer>
    </div>
  );
}
