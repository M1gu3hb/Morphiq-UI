"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Heart, Pause, Play, Volume2 } from "lucide-react";
import type { StyleSlug } from "@/lib/component-data";

type Specimen = "button" | "card" | "toggle" | "player" | "dial" | "nav";

export function SurfacePreview({
  variant,
  compact = false,
  specimen,
}: {
  variant: StyleSlug;
  compact?: boolean;
  specimen?: Specimen;
}) {
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [activeNav, setActiveNav] = useState(2);
  const [launched, setLaunched] = useState(false);

  if (specimen === "card") {
    return (
      <div className="specimen prism-card">
        <div className="prism-card-top"><span>MORPHIQ / 0428</span><i /></div>
        <strong>$24,880</strong>
        <p>Available balance</p>
        <div className="prism-card-bottom"><span>VIRTUAL</span><b>•• 7812</b></div>
      </div>
    );
  }

  if (specimen === "dial") {
    return (
      <div className="specimen dial-panel">
        <div className="dial-face"><i /><span /></div>
        <div><strong>62%</strong><span>Intensity</span></div>
      </div>
    );
  }

  if (specimen === "toggle") {
    return (
      <div className="specimen adaptive-switch">
        <span><i />Adaptive</span>
        <button
          aria-checked={adaptiveEnabled}
          aria-label={adaptiveEnabled ? "Disable adaptive mode" : "Enable adaptive mode"}
          onClick={() => setAdaptiveEnabled((enabled) => !enabled)}
          role="switch"
          type="button"
        ><i /></button>
      </div>
    );
  }

  if (specimen === "player") {
    return (
      <div className="specimen mini-player">
        <div className="album-shape"><Heart size={16} /></div>
        <div><strong>Soft focus</strong><span>Surface studies</span></div>
        <button
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={() => setPlaying((current) => !current)}
          type="button"
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
      </div>
    );
  }

  if (specimen === "nav") {
    const navItems = [
      { label: "Play", icon: <Play size={17} fill="currentColor" /> },
      { label: "Volume", icon: <Volume2 size={17} /> },
      { label: "Open", icon: <ArrowUpRight size={17} /> },
    ];
    return (
      <div className="specimen molded-nav">
        {navItems.map((item, index) => (
          <button
            aria-label={item.label}
            aria-pressed={activeNav === index}
            className={activeNav === index ? "molded-nav-active" : undefined}
            key={item.label}
            onClick={() => setActiveNav(index)}
            type="button"
          >
            {item.icon}
          </button>
        ))}
      </div>
    );
  }

  if (specimen === "button") {
    return (
      <button
        aria-pressed={launched}
        className="specimen soft-launch"
        onClick={() => setLaunched((current) => !current)}
        type="button"
      >
        {launched ? "Launched" : "Launch it"}
        {launched ? <Check size={17} /> : <ArrowUpRight size={17} />}
      </button>
    );
  }

  return (
    <div className={`surface-demo surface-demo-${variant} ${compact ? "surface-demo-compact" : ""}`}>
      {variant === "clay" && <div className="demo-clay"><i /><span>Press</span></div>}
      {variant === "glass" && (
        <div className="demo-glass"><span>18:42</span><strong>Focus mode</strong><i /></div>
      )}
      {variant === "skeuo" && (
        <div className="demo-skeuo"><div className="demo-skeuo-dial"><i /></div><span>LEVEL 08</span></div>
      )}
      {variant === "adaptive" && (
        <div className="demo-adaptive"><i /><strong>Fluid</strong><span>Wide → compact</span></div>
      )}
    </div>
  );
}
