'use client';
import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import { CheckIcon, CloseIcon } from '../core/icons';

export type StepStatus = 'done' | 'current' | 'upcoming' | 'error';
export interface StepperStep { id?: string; title: ReactNode; description?: ReactNode; status?: StepStatus }

export interface StepperProps {
  steps: StepperStep[];
  /** The current step; steps before it are done, after it upcoming. A step's own `status` wins. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  /** Let people go back to a finished step. */
  onStepClick?: (index: number) => void;
  /** Names the list ("Brief progress"). */
  label?: string;
  className?: string;
}

const WORD: Record<StepStatus, string> = { done: 'done', current: 'current step', upcoming: 'not started', error: 'needs attention' };

/** Where a multi-step job is up to. State is shown by shape and words, never colour alone. */
export function Stepper({ steps, current = 0, orientation = 'horizontal', onStepClick, label = 'Progress', className }: StepperProps) {
  return (
    <ol className={cx('ar-stepper', orientation === 'horizontal' && 'ar-scroll-x', `ar-stepper--${orientation}`, className)} aria-label={label}>
      {steps.map((s, i) => {
        const st: StepStatus = s.status ?? (i < current ? 'done' : i === current ? 'current' : 'upcoming');
        const mark = <span className="ar-step-mark" aria-hidden="true">{st === 'done' ? <CheckIcon size={14} /> : st === 'error' ? <CloseIcon size={14} /> : i + 1}</span>;
        const text = <span className="ar-step-text"><span className="ar-step-title">{s.title}</span>{s.description && <span className="ar-step-desc">{s.description}</span>}<span className="ar-visually-hidden">, {WORD[st]}</span></span>;
        const clickable = !!onStepClick && st === 'done';
        return (
          <li key={s.id ?? i} className="ar-step" data-status={st} aria-current={st === 'current' ? 'step' : undefined}>
            {clickable ? <button type="button" className="ar-step-inner" onClick={() => onStepClick!(i)}>{mark}{text}</button> : <div className="ar-step-inner">{mark}{text}</div>}
          </li>
        );
      })}
    </ol>
  );
}
