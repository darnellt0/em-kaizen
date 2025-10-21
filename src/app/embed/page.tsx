"use client";

import { useEffect } from "react";
import KaizenChallengePage from "@/components/KaizenChallengePage";

/**
 * Minimal, iframe-friendly route.
 * - Hides header/footer via CSS for a clean embed
 * - Auto-resizes the parent <iframe> height with postMessage + ResizeObserver
 */
export default function EmbedPage() {
  useEffect(() => {
    const send = () => {
      try {
        const height =
          Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
          ) || document.body.offsetHeight || 800;
        window.parent?.postMessage({ type: "EM_EMBED_HEIGHT", height }, "*");
      } catch {}
    };

    const ro = new ResizeObserver(() => send());
    ro.observe(document.documentElement);
    ro.observe(document.body);

    // Initial send after layout paint
    const t = setTimeout(send, 150);

    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Hide site chrome in embeds */}
      <style>{`
        header, footer, .no-embed { display: none !important; }
        body { background: transparent; }
      `}</style>
      <KaizenChallengePage />
    </div>
  );
}
