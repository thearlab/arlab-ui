import React, { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button, Logo } from "./ui.js";

export function Loader({ label = "Loading", size = 24, decorative = false }) {
  return (
    <span
      className="contour-loader"
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          className="loader-track"
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          pathLength="100"
        />
        <rect
          className="loader-path"
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          pathLength="100"
        />
      </svg>
    </span>
  );
}

export function PageLoading({
  title = "Getting your workspace ready",
  description = "Loading your projects, people, and latest updates.",
  onCancel,
}) {
  return (
    <section className="page-loading" aria-label="Workspace loading">
      <header>
        <Logo />
        <span>ARLAB workspace</span>
      </header>
      <div className="page-loading-center" role="status" aria-live="polite">
        <div className="loading-symbol">
          <Loader size={32} decorative />
        </div>
        <span className="loading-eyebrow">One moment</span>
        <h2>{title}</h2>
        <p>{description}</p>
        {onCancel && (
          <Button variant="quiet" className="compact-action" onClick={onCancel}>
            Cancel loading
          </Button>
        )}
      </div>
      <footer>
        <span className="loading-dot" aria-hidden="true" />
        Your workspace will appear here shortly.
      </footer>
    </section>
  );
}

export function LoadingPreview({ onOpenWorkspace }) {
  const [complete, setComplete] = useState(false);
  return (
    <div className="loading-preview">
      <div className="loading-preview-bar">
        <div>
          <strong>Full-page loading</strong>
          <span>A quiet transition into the workspace.</span>
        </div>
        <Button
          variant="quiet"
          className="compact-action"
          onClick={() => setComplete(!complete)}
        >
          {complete ? <RotateCcw size={12} /> : <Check size={12} />}{" "}
          {complete ? "Replay loading" : "Preview completion"}
        </Button>
      </div>
      {complete ? (
        <section className="loading-complete" role="status">
          <span className="loading-complete-mark">
            <Check size={22} />
          </span>
          <h2>Your workspace is ready.</h2>
          <p>Everything is in place. Pick up where you left off.</p>
          <Button variant="primary" onClick={onOpenWorkspace}>
            Open workspace
          </Button>
        </section>
      ) : (
        <PageLoading />
      )}
    </div>
  );
}
