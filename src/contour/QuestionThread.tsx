import {useState,type ReactNode} from 'react';
import {Button} from './ui.js';
import {LoadingBar,PillButton} from './library.js';
import {Input} from './BaseFields.js';

/** One question already answered. onChange present = the person may still change it (a "Change" action shows). */
export interface QuestionThreadEntry {id?: string; question: ReactNode; answer: ReactNode; onChange?: () => void}
/** The question asked now. answer prefills the input (changing an earlier answer); id resets the input when the question changes. */
export interface QuestionThreadCurrent {id?: string; context?: ReactNode; question: ReactNode; why?: ReactNode; options?: string[]; answer?: string}
export interface QuestionThreadProps {
  history?: QuestionThreadEntry[];
  current?: QuestionThreadCurrent | null;
  onAnswer: (text: string) => void;
  onDontKnow?: () => void;
  dontKnowLabel?: string;
  /** One line each, e.g. "Re-assessing Pearl Breath with your answers..." */
  waiting?: string[];
  /** 1-based number of the current question, shown after the context. */
  progress?: {index: number; total: number};
  /** Shown when there is no current question and nothing is waiting. null hides it. */
  doneLabel?: ReactNode;
  historyLabel?: string;
  autoFocus?: boolean;
}

function CurrentQuestion({current,progress,onAnswer,onDontKnow,dontKnowLabel,autoFocus}: {current: QuestionThreadCurrent} & Pick<QuestionThreadProps,'progress'|'onAnswer'|'onDontKnow'|'dontKnowLabel'|'autoFocus'>) {
  const [draft,setDraft]=useState(current.answer??'');
  const step=progress&&`question ${progress.index} of ${progress.total}`;
  return <>
    {(current.context||step)&&<p className="ct-question-thread-context">{current.context}{current.context&&step&&' · '}{step}</p>}
    <p className="ct-question-thread-ask">{current.question}</p>
    {current.why&&<p className="ct-question-thread-why">Why we ask: {current.why}</p>}
    {!!current.options?.length&&<div className="ct-question-thread-options" role="group" aria-label="Quick answers">{current.options.map(option=><PillButton key={option} onClick={()=>onAnswer(option)}>{option}</PillButton>)}</div>}
    <form className="ct-question-thread-reply" onSubmit={event=>{event.preventDefault();if(draft.trim())onAnswer(draft.trim());}}>
      <Input aria-label="Your answer" autoFocus={autoFocus} value={draft} placeholder="Type your answer" onChange={event=>setDraft(event.target.value)}/>
      <Button type="submit" variant="primary" disabled={!draft.trim()}>Answer</Button>
      {onDontKnow&&<Button type="button" variant="quiet" onClick={onDontKnow}>{dontKnowLabel}</Button>}
    </form>
  </>;
}

/** An agent asking a person questions one at a time. Presentational and controlled: the caller owns questions, answers, sending and errors. */
export function QuestionThread({history=[],current,onAnswer,onDontKnow,dontKnowLabel="I don't know",waiting=[],progress,doneLabel='All answered.',historyLabel='Your answers so far',autoFocus=true}: QuestionThreadProps) {
  return <div className="ct-question-thread">
    {history.length>0&&<ol className="ct-question-thread-history" aria-label={historyLabel}>
      {history.map((entry,index)=><li key={entry.id??index}>
        <p className="ct-question-thread-q">{entry.question}</p>
        <p className="ct-question-thread-a">{entry.answer}{entry.onChange&&<button type="button" className="ct-question-thread-change" aria-label={typeof entry.question==='string'?`Change answer: ${entry.question}`:undefined} onClick={entry.onChange}>Change</button>}</p>
      </li>)}
    </ol>}
    {waiting.map(label=><div key={label} className="ct-question-thread-wait" role="status"><LoadingBar label={label}/><span>{label}</span></div>)}
    <div className="ct-question-thread-now" aria-live="polite" data-empty={!current||undefined}>
      {current?<CurrentQuestion key={current.id??String(current.question)} current={current} progress={progress} onAnswer={onAnswer} onDontKnow={onDontKnow} dontKnowLabel={dontKnowLabel} autoFocus={autoFocus}/>
        :!waiting.length&&doneLabel!=null&&<p className="ct-question-thread-context">{doneLabel}</p>}
    </div>
  </div>;
}
