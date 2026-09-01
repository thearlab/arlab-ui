'use client';

import type { ReactNode } from 'react';
import { CheckIcon } from './icons';

export interface StepDef {
  title: ReactNode;
  description?: ReactNode;
}

export interface StepsProps {
  steps: StepDef[];
  /** Index of the current step; steps before it render as done. Omit for a static, unnumbered-progress list (arlab-studio's guide-steps use case). */
  currentIndex?: number;
}

export function Steps({ steps, currentIndex }: StepsProps) {
  return (
    <div className="arlab-steps">
      {steps.map((step, i) => {
        const done = currentIndex !== undefined && i < currentIndex;
        const current = i === currentIndex;
        return (
          <div className={['arlab-step', done ? 'done' : '', current ? 'current' : ''].filter(Boolean).join(' ')} key={i}>
            <span className="arlab-step-index">{done ? <CheckIcon size={13} strokeWidth={2.5} /> : i + 1}</span>
            <div className="arlab-step-body">
              <div className="arlab-step-title">{step.title}</div>
              {step.description ? <div className="arlab-step-description">{step.description}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}