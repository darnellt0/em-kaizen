// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center text-center p-10">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--em-slate)" }}>Page not found</h1>
        <p className="text-[var(--em-muted)]">Try the <a className="underline" href="/">Kaizen 1% Challenge</a>.</p>
      </div>
    </main>
  );
}
