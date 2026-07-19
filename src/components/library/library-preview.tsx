"use client";

import { useState, type CSSProperties } from "react";
import { ArrowUpRight, Check, ChevronRight, Download, Music2, Pause, Play, Sparkles } from "lucide-react";
import type { LibraryComponent } from "@/lib/library-data";

type PreviewStyle = CSSProperties & {
  "--preview-accent": string;
  "--preview-speed": string;
};

export function LibraryPreview({ item, text, accent, speed = 1 }: { item: LibraryComponent; text: string; accent: string; speed?: number }) {
  const [activeNav, setActiveNav] = useState(1);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activated, setActivated] = useState(false);
  const style: PreviewStyle = {
    "--preview-accent": accent,
    "--preview-speed": `${Math.max(0.35, 2.2 - speed)}s`,
  };

  if (item.category === "loaders") {
    return (
      <div className={`library-object loader-object loader-${item.style} motion-${item.motion}`} style={style}>
        <div className="loader-visual"><i /><i /><i /></div>
        <span>{text}</span>
      </div>
    );
  }

  if (item.category === "cards") {
    return (
      <div className={`library-object library-card-object surface-${item.style} motion-${item.motion}`} style={style}>
        <div className="library-card-top"><span>MORPHIQ / 024</span><Sparkles size={14} /></div>
        <strong>{text}</strong>
        <p>Surface intelligence</p>
        <div className="library-card-bars"><i /><i /><i /></div>
      </div>
    );
  }

  if (item.category === "navigation") {
    const navItems = ["Home", text, "Next"];
    return (
      <div className={`library-object nav-object surface-${item.style} motion-${item.motion}`} style={style}>
        {navItems.map((label, index) => (
          <button
            aria-label={label}
            aria-pressed={activeNav === index}
            className={activeNav === index ? "nav-object-active" : undefined}
            key={`${label}-${index}`}
            onClick={() => setActiveNav(index)}
            type="button"
          >
            {index === 0 ? <i /> : index === 2 ? <ChevronRight size={16} /> : text}
          </button>
        ))}
      </div>
    );
  }

  if (item.category === "feedback") {
    return (
      <div className={`library-object feedback-object surface-${item.style} motion-${item.motion}`} style={style}>
        <div className="feedback-icon"><Check size={17} /></div>
        <div><strong>{text}</strong><span>{feedbackOpen ? "Details opened" : "Synced just now"}</span></div>
        <button
          aria-expanded={feedbackOpen}
          aria-label={feedbackOpen ? "Close notification" : "Open notification"}
          onClick={() => setFeedbackOpen((open) => !open)}
          type="button"
        ><ArrowUpRight size={15} /></button>
      </div>
    );
  }

  if (item.category === "media") {
    return (
      <div className={`library-object media-object surface-${item.style} motion-${item.motion}`} style={style}>
        <div className="media-art"><Music2 size={20} /></div>
        <div><strong>{text}</strong><span>Morphiq sessions</span><div className="media-wave"><i /><i /><i /><i /><i /></div></div>
        <button
          aria-label={playing ? "Pause media" : "Play media"}
          aria-pressed={playing}
          onClick={() => setPlaying((current) => !current)}
          type="button"
        >
          {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </button>
      </div>
    );
  }

  return (
    <button
      aria-pressed={activated}
      className={`library-object action-object surface-${item.style} motion-${item.motion}`}
      onClick={() => setActivated((current) => !current)}
      style={style}
      type="button"
    >
      {activated ? <Check size={16} /> : item.motion === "bounce" ? <Download size={16} /> : null}
      <span>{text}</span>
      <ArrowUpRight size={16} />
    </button>
  );
}
