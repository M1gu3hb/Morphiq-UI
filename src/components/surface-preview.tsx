import { ArrowUpRight, Heart, Pause, Play, Volume2 } from "lucide-react";
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
        <button aria-label="Adaptive mode enabled"><i /></button>
      </div>
    );
  }

  if (specimen === "player") {
    return (
      <div className="specimen mini-player">
        <div className="album-shape"><Heart size={16} /></div>
        <div><strong>Soft focus</strong><span>Surface studies</span></div>
        <button aria-label="Pause"><Pause size={16} fill="currentColor" /></button>
      </div>
    );
  }

  if (specimen === "nav") {
    return (
      <div className="specimen molded-nav">
        <button aria-label="Play"><Play size={17} fill="currentColor" /></button>
        <button aria-label="Volume"><Volume2 size={17} /></button>
        <button className="molded-nav-active" aria-label="Open"><ArrowUpRight size={17} /></button>
      </div>
    );
  }

  if (specimen === "button") {
    return <button className="specimen soft-launch">Launch it <ArrowUpRight size={17} /></button>;
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
