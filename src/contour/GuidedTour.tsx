"use client";

import {
  useContext,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui.js";
import { ContourThemeContext } from "./ThemeContext.js";
import { ContourProvider } from "./provider.js";
import {
  placeTour,
  tourDue,
  TOUR_PHONE,
  type TourPlacement,
} from "../tourPlace.js";

/** One stop on the tour: what to point at, and two lines of plain words. */
export interface TourStep {
  /** CSS selector(s), ideally `[data-tour="..."]`; the first one that is on screen wins. */
  target: string | string[];
  /** 1 to 3 words: the name as it appears on screen. */
  title: string;
  /** At most 2 short sentences: what you can do there. */
  body: string;
  placement?: TourPlacement;
}

/** How a tour ended. `empty` = no step found its target, so it never opened (not counted as seen). */
export type TourEnd = "done" | "skip" | "empty";

export interface GuidedTourProps {
  steps: TourStep[];
  open: boolean;
  onClose: (why: TourEnd) => void;
}

const WAIT = 1500; // a slow page gets this long to draw its targets
const sels = (s: TourStep) => ([] as string[]).concat(s.target);
const shown = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return (
    r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"
  );
};
const find = (s: TourStep): HTMLElement | null => {
  for (const sel of sels(s)) {
    let el: Element | null = null;
    try {
      el = document.querySelector(sel);
    } catch {
      /* a bad selector is a missing target */
    }
    if (shown(el)) return el;
  }
  return null;
};
const reduced = () =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
const typing = (el: Element | null) =>
  !!el &&
  (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) ||
    (el as HTMLElement).isContentEditable);
const isLocal = () =>
  typeof location !== "undefined" &&
  /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

/** The guided tour: a small popup next to each target, a ring around it, the page dimmed a little.
 * Not a modal: the page stays usable. Steps whose target is not on screen are skipped. */
export function GuidedTour({ steps, open, onClose }: GuidedTourProps) {
  const mode = useContext(ContourThemeContext);
  const opener = useRef<HTMLElement | null>(null);
  const [list, setList] = useState<TourStep[] | null>(null);
  const [i, setI] = useState(0);
  const pop = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLSpanElement>(null);
  const target = useRef<HTMLElement | null>(null);
  const latest = useRef({ steps, onClose });
  latest.current = { steps, onClose };
  const id = useId();

  // Opening: give the page up to WAIT to draw, then keep only the steps whose target is on screen.
  useEffect(() => {
    if (!open) {
      setList(null);
      return;
    }
    opener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const t0 = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = () => {
      const all = latest.current.steps;
      const found = all.filter((s) => find(s));
      if (found.length < all.length && Date.now() - t0 < WAIT) {
        timer = setTimeout(poll, 100);
        return;
      }
      if (isLocal())
        all
          .filter((s) => !found.includes(s))
          .forEach((s) =>
            console.warn(
              `[@arlab/ui Tour] step "${s.title}" skipped: nothing on screen matches ${sels(s).join(", ")}`,
            ),
          );
      if (!found.length) {
        latest.current.onClose("empty");
        return;
      }
      setI(0);
      setList(found);
    };
    poll();
    return () => clearTimeout(timer);
  }, [open]);

  const end = useCallback((why: TourEnd) => {
    setList(null);
    latest.current.onClose(why);
    opener.current?.focus({ preventScroll: true });
  }, []);

  const place = useCallback(() => {
    const p = pop.current,
      t = target.current;
    if (!p || !t || !ring.current) return;
    const r = t.getBoundingClientRect();
    Object.assign(ring.current.style, {
      top: `${r.top - 4}px`,
      left: `${r.left - 4}px`,
      width: `${r.width + 8}px`,
      height: `${r.height + 8}px`,
    });
    const spot = placeTour(
      r,
      p.offsetWidth,
      p.offsetHeight,
      window.innerWidth,
      window.innerHeight,
      list?.[i]?.placement,
    );
    p.dataset.side = spot.side;
    p.style.left = `${spot.x}px`;
    p.style.top = `${spot.y}px`;
    if (arrow.current) {
      const a = arrow.current.style;
      a.left = a.top = "";
      if (spot.side === "top" || spot.side === "bottom")
        a.left = `${spot.arrow}px`;
      else if (spot.side !== "dock") a.top = `${spot.arrow}px`;
    }
  }, [list, i]);

  // Each step: find its target (it may have gone since the tour opened), bring it into view, place, focus.
  useLayoutEffect(() => {
    if (!list) return;
    const s = list[i];
    const el = s && find(s);
    if (!el) {
      const rest = list.filter((x) => x !== s);
      if (!rest.length) {
        end("done");
        return;
      }
      setI(Math.min(i, rest.length - 1));
      setList(rest);
      return;
    }
    target.current = el;
    const behavior: ScrollBehavior = reduced() ? "auto" : "smooth";
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior });
    place();
    // On a phone the card docks at the bottom: keep the target clear of it.
    if (window.innerWidth <= TOUR_PHONE && pop.current) {
      const r = el.getBoundingClientRect();
      if (r.bottom > window.innerHeight - pop.current.offsetHeight - 28)
        el.scrollIntoView({ block: "center", behavior: "auto" });
    }
    const raf = requestAnimationFrame(place);
    pop.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(raf);
  }, [list, i, place, end]);

  useEffect(() => {
    if (!list) return;
    const next = () => (i < list.length - 1 ? setI(i + 1) : end("done"));
    const onKey = (e: KeyboardEvent) => {
      if (typing(document.activeElement)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        end("skip");
      } else if (
        e.key === "ArrowRight" ||
        (e.key === "Enter" && document.activeElement === pop.current)
      ) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (i > 0) setI(i - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [list, i, place, end]);

  if (!list || !list[i] || typeof document === "undefined") return null;
  const s = list[i];
  const last = i === list.length - 1;
  return createPortal(
    <ContourProvider
      mode={
        mode ??
        (opener.current?.closest("[data-mode]")?.getAttribute("data-mode") ===
        "dark"
          ? "dark"
          : "light")
      }
      className="ct-guided-tour"
    >
      <div ref={ring} className="arlab-tour-ring" aria-hidden="true" />
      <div
        key={i}
        ref={pop}
        className="arlab-tour"
        role="dialog"
        aria-labelledby={`${id}t`}
        aria-describedby={`${id}b`}
        tabIndex={-1}
      >
        <span ref={arrow} className="arlab-tour-arrow" aria-hidden="true" />
        <div className="arlab-tour-head">
          <span className="arlab-tour-count">
            {i + 1} of {list.length}
          </span>
          <span className="arlab-tour-dots" aria-hidden="true">
            {list.map((_, k) => (
              <i key={k} className={k === i ? "on" : undefined} />
            ))}
          </span>
        </div>
        <h3 id={`${id}t`} className="arlab-tour-title">
          {s.title}
        </h3>
        <p id={`${id}b`} className="arlab-tour-body">
          {s.body}
        </p>
        <div className="arlab-tour-actions">
          <Button type="button" onClick={() => end("skip")}>
            {last ? "Close" : "Skip tour"}
          </Button>
          <span className="arlab-tour-grow" />
          {i > 0 && (
            <Button type="button" onClick={() => setI(i - 1)}>
              Back
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            onClick={() => (last ? end("done") : setI(i + 1))}
          >
            {last ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </ContourProvider>,
    document.body,
  );
}

export interface UseGuidedTourOptions {
  steps: TourStep[];
  /** Optional key for versioned completion persistence. No storage is touched without it. */
  storageKey?: string;
  version?: number;
  autoStart?: boolean;
  onClose?: (reason: TourEnd) => void;
}
/** Owns tour visibility and optional first-visit persistence. An empty tour is never marked seen. */
export function useGuidedTour({steps,storageKey,version=1,autoStart=false,onClose}: UseGuidedTourOptions) {
  const [open,setOpen] = useState(false);
  const current = useRef({storageKey,version,onClose});
  current.current = {storageKey,version,onClose};
  useEffect(() => {
    if (!autoStart) return;
    let seen: number | undefined;
    if (storageKey) {
      try {const stored = Number(localStorage.getItem(storageKey)); if (Number.isFinite(stored)) seen=stored;} catch { /* Storage denial must not break onboarding. */ }
    }
    if (tourDue(version,seen,0)) setOpen(true);
  },[storageKey,version,autoStart]);
  const start = useCallback(() => setOpen(true),[]);
  const close = useCallback((reason: TourEnd = 'skip') => {
    setOpen(false);
    const {storageKey,version,onClose} = current.current;
    if (reason !== 'empty' && storageKey) {
      try {localStorage.setItem(storageKey,String(version));} catch { /* Persistence is optional. */ }
    }
    onClose?.(reason);
  },[]);
  const reset = useCallback(() => {
    if (current.current.storageKey) {
      try {localStorage.removeItem(current.current.storageKey);} catch { /* Persistence is optional. */ }
    }
    setOpen(false);
  },[]);
  return {open,start,close,reset,tourProps:{steps,open,onClose:close}};
}
