'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type PillTone = 'default' | 'fresh' | 'quiet' | 'strong' | 'ok' | 'warn' | 'bad' | 'info';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  /** `fresh` (accent tint + dot) for something that changed recently; `strong` (ink) for the one
   * number that matters on a bar; `quiet` (dashed) for an aside; ok / warn / bad / info for status. */
  tone?: PillTone;
  children: ReactNode;
}

/** A small rounded label for a count, a state or a fact. Replaces "a · b · c" meta strings:
 * one fact per pill, so nothing needs a separator. */
export function Pill({ tone = 'default', className = '', children, ...rest }: PillProps) {
  return <span className={['arlab-pill', tone !== 'default' ? `t-${tone}` : '', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { tone?: PillTone; on?: boolean; children: ReactNode }

/** A pill that does something: a filter to remove, a tag to toggle, an entity to open. */
export function PillButton({ tone = 'default', on = false, className = '', children, ...rest }: PillButtonProps) {
  return <button type="button" aria-pressed={on || undefined} className={['arlab-pill', 'arlab-pill-btn', tone !== 'default' ? `t-${tone}` : '', on ? 'on' : '', className].filter(Boolean).join(' ')} {...rest}>{children}</button>;
}
