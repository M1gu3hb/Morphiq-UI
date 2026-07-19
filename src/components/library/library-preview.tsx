"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, Check, ChevronRight, Download, Music2, Play, Sparkles } from "lucide-react";
import type { LibraryComponent } from "@/lib/library-data";

type PreviewStyle = CSSProperties & {
  "--preview-accent": string;
  "--preview-speed": string;
};

export function LibraryPreview({ item, text, accent, speed = 1 }: { item: LibraryComponent; text: string; accent: string; speed?: number }) {
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
    return (
      <div className={`library-object nav-object surface-${item.style} motion-${item.motion}`} style={style}>
        <button aria-label="Home"><i /></button>
        <button className="nav-object-active">{text}</button>
        <button aria-label="Next"><ChevronRight size={16} /></button>
      </div>
    );
  }

  if (item.category === "feedback") {
    return (
      <div className={`library-object feedback-object surface-${item.style} motion-${item.motion}`} style={style}>
        <div className="feedback-icon"><Check size={17} /></div>
        <div><strong>{text}</strong><span>Synced just now</span></div>
        <button aria-label="Open notification"><ArrowUpRight size={15} /></button>
      </div>
    );
  }

  if (item.category === "media") {
    return (
      <div className={`library-object media-object surface-${item.style} motion-${item.motion}`} style={style}>
        <div className="media-art"><Music2 size={20} /></div>
        <div><strong>{text}</strong><span>Morphiq sessions</span><div className="media-wave"><i /><i /><i /><i /><i /></div></div>
        <button aria-label="Play media"><Play size={15} fill="currentColor" /></button>
      </div>
    );
  }

  return (
    <button className={`library-object action-object surface-${item.style} motion-${item.motion}`} style={style} type="button">
      {item.motion === "bounce" ? <Download size={16} /> : null}
      <span>{text}</span>
      <ArrowUpRight size={16} />
    </button>
  );
}
