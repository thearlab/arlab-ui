import React, { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "./ui.js";

import { ArlabMark } from "../ArlabMark.js";

/** @param {{label?: string, size?: number, decorative?: boolean}} props */
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
        <circle className="loader-track" cx="12" cy="12" r="8.5" pathLength="100"/>
        <circle className="loader-path" cx="12" cy="12" r="8.5" pathLength="100"/>
      </svg>
    </span>
  );
}

/** @param {{title?: React.ReactNode, description?: React.ReactNode, onCancel?: React.MouseEventHandler<HTMLButtonElement>, mark?: React.ReactNode, workspaceName?: string, variant?: "signature" | "content-preview"}} props */
export function PageLoading({
  title = "Getting your workspace ready",
  description = "Loading your projects, people, and latest updates.",
  onCancel,
  mark = <ArlabMark compact height={28} />,
  workspaceName = "ARLAB workspace",
  variant = "content-preview",
}) {
  if(variant === "content-preview") return <section className="ct-content-loading" aria-label="Workspace loading" aria-busy="true">
    <div className="ct-content-loading-skeleton" aria-hidden="true"><div className="ct-content-loading-heading"><span/><span/></div><div className="ct-content-loading-cards">{[0,1,2].map(index=><div key={index}><span/><strong/><span/></div>)}</div><div className="ct-content-loading-rows">{[0,1,2,3].map(index=><div key={index}><span/><span/><span/></div>)}</div></div>
    <div className="ct-content-loading-copy" role="status" aria-live="polite"><Loader decorative size={28}/><h2>{title}</h2><p>{description}</p>{onCancel&&<Button variant="quiet" onClick={onCancel}>Cancel loading</Button>}</div>
  </section>;
  return (
    <section className="page-loading" aria-label="Workspace loading">
      <header>
        {mark}
        <span>{workspaceName}</span>
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

/** @param {{onOpenWorkspace?: React.MouseEventHandler<HTMLButtonElement>}} props */
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
