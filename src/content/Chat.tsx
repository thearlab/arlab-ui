'use client';
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { groupMessages } from '../lib/chat';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { ArrowDownIcon, ArrowUpIcon } from '../core/icons';
import { Spinner } from '../core/Spinner';

export type ChatStatus = 'sent' | 'pending' | 'failed';

export interface ChatBubbleProps {
  /** me: the person reading (right, accent tint). them: anyone else (left, card). */
  from: 'me' | 'them';
  author?: ReactNode;
  /** Shown small under the text ("9:02"). */
  time?: ReactNode;
  /** An Avatar, shown on the first bubble of a group from someone else. */
  avatar?: ReactNode;
  status?: ChatStatus;
  onRetry?: () => void;
  /** Hide the author line (follow-up bubbles in a group). */
  continued?: boolean;
  children: ReactNode;
  className?: string;
}

/** One message. Pending shows a spinner and "Sending"; failed says so in words and offers Retry. */
export function ChatBubble({ from, author, time, avatar, status = 'sent', onRetry, continued, children, className }: ChatBubbleProps) {
  return (
    <div className={cx('ar-chat-msg', `ar-chat-msg--${from}`, continued && 'ar-chat-msg--cont', className)} data-status={status}>
      {from === 'them' && <span className="ar-chat-av">{!continued && avatar}</span>}
      <div className="ar-chat-col">
        {!continued && author && <div className="ar-chat-author">{author}</div>}
        <div className="ar-chat-bubble">{children}</div>
        {(time || status !== 'sent') && (
          <div className="ar-chat-meta">
            {status === 'pending' && <><Spinner size={12} /> Sending</>}
            {status === 'failed' && <><span className="ar-chat-failed">Not sent.</span>{onRetry && <Button size="sm" variant="ghost" onClick={onRetry}>Retry</Button>}</>}
            {status === 'sent' && time}
          </div>
        )}
      </div>
    </div>
  );
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  author?: string;
  time?: string | number | Date;
  /** Plain text, or render it yourself with `renderBody` (Markdown for an assistant). */
  text?: string;
  status?: ChatStatus;
  avatar?: ReactNode;
}

export interface ChatThreadProps {
  messages: ChatMessage[];
  /** Names the thread ("Labby, this morning"). */
  label: string;
  renderBody?: (m: ChatMessage) => ReactNode;
  onRetry?: (m: ChatMessage) => void;
  /** Shown when there are no messages. */
  empty?: ReactNode;
  /** Someone is typing ("Labby is writing"). */
  typing?: ReactNode;
  className?: string;
}

const hhmm = (t: string | number | Date) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/** A conversation (role=log, new messages announced politely). Grouped by day and author. It keeps the
 * newest in view unless the reader has scrolled up; then a "New messages" button takes them down. */
export function ChatThread({ messages, label, renderBody, onRetry, empty, typing, className }: ChatThreadProps) {
  const box = useRef<HTMLDivElement>(null);
  const atEnd = useRef(true);
  const [unseen, setUnseen] = useState(0);
  const count = useRef(messages.length);
  const rows = groupMessages(messages);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const added = messages.length - count.current; count.current = messages.length;
    if (atEnd.current) el.scrollTop = el.scrollHeight;
    else if (added > 0) setUnseen((n) => n + added);
  }, [messages.length, typing]);
  const onScroll = () => {
    const el = box.current!; atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atEnd.current) setUnseen(0);
  };
  const down = () => { const el = box.current!; el.scrollTo({ top: el.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); setUnseen(0); };
  return (
    <div className={cx('ar-chat', className)}>
      <div ref={box} className="ar-chat-scroll ar-scroll" role="log" aria-label={label} aria-live="polite" tabIndex={0} onScroll={onScroll}>
        {!messages.length && <div className="ar-chat-empty">{empty ?? 'No messages yet.'}</div>}
        {rows.map(({ message: m, day, first }) => (
          <div key={m.id}>
            {day && <div className="ar-chat-day" role="separator" aria-label={day}><span>{day}</span></div>}
            <ChatBubble from={m.from} author={m.author} continued={!first} avatar={m.avatar} status={m.status}
              time={m.time !== undefined ? <time dateTime={new Date(m.time).toISOString()}>{hhmm(m.time)}</time> : undefined}
              onRetry={onRetry ? () => onRetry(m) : undefined}>
              {renderBody ? renderBody(m) : m.text}
            </ChatBubble>
          </div>
        ))}
        {typing && <div className="ar-chat-typing"><span className="ar-chat-dots" aria-hidden="true"><i /><i /><i /></span>{typing}</div>}
      </div>
      {unseen > 0 && <Button size="sm" variant="primary" className="ar-chat-new" icon={<ArrowDownIcon />} onClick={down}>{unseen === 1 ? '1 new message' : `${unseen} new messages`}</Button>}
    </div>
  );
}

export interface ChatComposerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  /** Gets the trimmed text; the box clears after. */
  onSend: (text: string) => void;
  sending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** The field's name for screen readers (default "Message"). */
  label?: string;
  /** An attach button or other tools, left of the send button. */
  tools?: ReactNode;
  className?: string;
}

/** The message box: grows with the text, Enter sends, Shift+Enter starts a new line. */
export function ChatComposer({ value, defaultValue = '', onChange, onSend, sending, disabled, placeholder = 'Write a message', label = 'Message', tools, className }: ChatComposerProps) {
  const [v, setV] = useControllable(value, defaultValue, onChange);
  const ta = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = ta.current; if (!el) return; el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; }, [v]);
  const can = !!v.trim() && !sending && !disabled;
  const send = () => { if (!can) return; onSend(v.trim()); setV(''); };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } };
  return (
    <div className={cx('ar-composer', className)} data-disabled={disabled || undefined}>
      <textarea ref={ta} rows={1} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={onKey} placeholder={placeholder} aria-label={label} disabled={disabled} className="ar-composer-input" />
      <div className="ar-composer-tools">
        {tools}
        <IconButton variant="primary" label={sending ? 'Sending' : 'Send'} loading={sending} disabled={!can && !sending} onClick={send}><ArrowUpIcon /></IconButton>
      </div>
    </div>
  );
}
