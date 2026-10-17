import { SortControl } from './SortControl.js';
import { Input, Textarea } from "./BaseFields.js";
import { Icon as RegistryIcon } from "./icons.js";
export { Input, Textarea } from "./BaseFields.js";
import React, {
  useState,
  useRef,
  useId,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Search,
  Copy,
  FileText,
  Folder,
  ArrowUpRight,
  MoreHorizontal,
  CheckCheck,
  GripVertical,
  CalendarDays,
  BookOpen,
  LogIn,
  Settings2,
  User,
  Info,
  ArrowRight,
  Clock3,
} from "lucide-react";
export { ScrollArea } from "./scroll-area.js";
export { Loader, PageLoading } from "./loading.js";
import { Loader } from "./loading.js";
import { ScrollArea } from "./scroll-area.js";
import {
  Button,
  IconButton,
  Avatar,
  Status,
  Modal,
  Meter,
  Notice,
  EmptyState,
  Dropdown,
  FileUpload,
  SectionHead,
  Logo,
} from "./ui.js";
export {
  Button,
  IconButton,
  Avatar,
  Meter,
  Notice,
  Dropdown,
  FileUpload,
  SectionHead,
};
/** @typedef {{separator: true} | {separator?: false, label: string, disabled?: boolean, danger?: boolean, onSelect?: () => void, icon?: React.ElementType | React.ReactElement | null | false, shortcut?: React.ReactNode}} DropdownMenuItem
 * @typedef {string | {id?: string, label: React.ReactNode, href?: string, title?: string, onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>}} BreadcrumbItem
 * @typedef {{id: string|number, name: string, client?: string, status: string, owner?: React.ReactNode, due?: React.ReactNode, progress: number}} ProjectRecord
 */
export const Pill = Status;
export const StatusPill = Status;
export const Dropzone = FileUpload;
export const Select = Dropdown;
export const Picker = Dropdown;
/** @param {import("./ui.js").DropdownProps} props */
export function ComboboxPicker(props) {
  return <Dropdown {...props} searchable />;
}
/** @param {React.AnchorHTMLAttributes<HTMLAnchorElement>} props */
export function TextLink({ children, ...props }) {
  return (
    <a className="lib-text-link" {...props}>
      {children}
    </a>
  );
}
/** @param {{children?: React.ReactNode}} props */
export function Kbd({ children }) {
  return <kbd>{children}</kbd>;
}
/** @param {{label: React.ReactNode, hint?: React.ReactNode, error?: React.ReactNode, required?: boolean, children?: React.ReactNode}} props */
export function Field({ label, hint, error, required, children }) {
  const id = useId();
  return (
    <div className="lib-field">
      <label htmlFor={id}>
        {label}
        {required && <span>Required</span>}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id,
            required,
            "aria-invalid": !!error,
            "aria-describedby": hint || error ? `${id}-hint` : undefined,
          })
        : children}
      {(hint || error) && (
        <p
          id={`${id}-hint`}
          className={error ? "lib-error" : ""}
          role={error ? "alert" : undefined}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
/** @param {React.InputHTMLAttributes<HTMLInputElement> & {label: React.ReactNode, hint?: React.ReactNode, trailing?: React.ReactNode}} props */
export function Checkbox({label,hint,trailing,'aria-describedby':describedBy,'aria-labelledby':labelledBy,'aria-label':ariaLabel,...props}) {
 const id=useId(),hasHint=hint!==undefined&&hint!==null&&hint!==false;
 return <label className="lib-choice" data-choice="checkbox"><input type="checkbox" {...props} aria-label={ariaLabel} aria-labelledby={labelledBy??(ariaLabel?undefined:`${id}-label`)} aria-describedby={[describedBy,hasHint?`${id}-hint`:undefined].filter(Boolean).join(' ')||undefined}/><span className="ct-choice-label" id={`${id}-label`}>{label}</span>{trailing!=null&&<span className="ct-choice-trailing">{trailing}</span>}{hasHint&&<small className="ct-choice-hint" id={`${id}-hint`}>{hint}</small>}</label>;
}
/** @param {React.InputHTMLAttributes<HTMLInputElement> & {label: React.ReactNode}} props */
export function Radio({ label, ...props }) {
  return (
    <label className="lib-choice">
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  );
}
/** @param {React.InputHTMLAttributes<HTMLInputElement> & {label?: React.ReactNode, hint?: React.ReactNode}} props */
export function Switch({ label = undefined, hint = undefined, ...props }) {
  return (
    <label className="switch-row" data-standalone={label == null && hint == null || undefined}>
      {(label != null || hint != null) && <span>
        {label != null && <strong>{label}</strong>}
        {hint && <small>{hint}</small>}
      </span>}
      <input type="checkbox" role="switch" {...props} />
      <span className="switch-visual" />
    </label>
  );
}
export const SwitchRow = Switch;
/** @param {Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label?: string; inputRef?: import("react").RefObject<HTMLInputElement>; onChange: (event: any) => void }} props */
export function SearchField({
  value,
  onChange,
  label = "Search",
  placeholder = label,
  inputRef = undefined,
  ...inputProps
}) {
  const ownRef=useRef(null),fieldRef=inputRef || ownRef;
  return (
    <div className="search-field">
      <Search size={16} />
      <Input {...inputProps} inputRef={fieldRef} variant="embedded"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <IconButton
          label="Clear search"
          disabled={inputProps.disabled}
          onClick={() => {onChange({ target: { value: "" } });fieldRef.current?.focus();}}
        >
          <X size={14} />
        </IconButton>
      )}
    </div>
  );
}
/** @param {{options: (string | {label: React.ReactNode, value: string, disabled?: boolean})[], value: string, onChange: (value: string) => void, label?: string}} props */
export function SegmentedControl({ options, value, onChange, label = "View" }) {
  const items = options.map(option => typeof option === "string" ? {value:option,label:option} : option);
  return (
    <div className="segments" role="group" aria-label={label}>
      {items.map(item => (
        <button type="button" key={item.value} disabled={item.disabled}
          aria-pressed={value === item.value} onClick={() => onChange(item.value)}
          onKeyDown={event => {
            if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
            const enabled = items.filter(option => !option.disabled);
            if (!enabled.length) return;
            event.preventDefault();
            const index = enabled.findIndex(option => option.value === item.value);
            const next = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : enabled.length - 1)) % enabled.length;
            onChange(enabled[next].value);
            event.currentTarget.parentElement?.querySelectorAll("button:not(:disabled)")[next]?.focus();
          }}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
/** @param {{options: (string | {label: string, value?: string, id?: string, count?: number, disabled?: boolean})[], value: string, onChange: (value: string) => void, label?: string}} props */
export function TabStrip({ options, value, onChange, label = "Sections" }) {
  const id=useId();
  const tabs=options.map(option=>typeof option==='string'?{label:option,value:option}:{...option,value:option.value??option.id??option.label});
  const enabled=tabs.map((tab,index)=>({tab,index})).filter(({tab})=>!tab.disabled);
  const active=enabled.some(({tab})=>tab.value===value)?value:enabled[0]?.tab.value;
  return <div className="detail-tabs" role="tablist" aria-label={label}>{tabs.map((tab,index)=><button type="button" id={`${id}-${index}`} role="tab" key={tab.value} disabled={tab.disabled} aria-selected={active===tab.value} tabIndex={active===tab.value?0:-1} onClick={()=>onChange(tab.value)} onKeyDown={event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||!enabled.length)return;
    event.preventDefault();const at=enabled.findIndex(item=>item.index===index);
    const next=event.key==='Home'?0:event.key==='End'?enabled.length-1:(at+(event.key==='ArrowRight'?1:enabled.length-1))%enabled.length;
    const target=enabled[next];onChange(target.tab.value);document.getElementById(`${id}-${target.index}`)?.focus();
  }}><span>{tab.label}</span>{tab.count!==undefined&&<span className="ct-tab-count">{tab.count.toLocaleString()}</span>}</button>)}</div>;
}
/** @param {{children?:React.ReactNode,onRemove?:React.MouseEventHandler<HTMLButtonElement>,onClick?:React.MouseEventHandler<HTMLButtonElement>,disabled?:boolean}} props */
export function Chip({children,onRemove,onClick,disabled=false}) {
  if(onClick)return <button type="button" className="ct-chip-reset" onClick={onClick} disabled={disabled}>{children}</button>;
  return (
    <span className="removable-tag">
      <span className="ct-chip-label" title={typeof children === 'string' ? children : undefined}>{children}</span>
      {onRemove && (
        <button type="button" className="ct-chip-remove" aria-label={`Remove ${children}`} onClick={onRemove}>
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
/** @param {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {children?: import('react').ReactNode,selected?:boolean,variant?:'default'|'quiet',tone?:'quiet'|'ok'|'warn'|'bad'|'info',count?:number,dot?:boolean}} props */
export function PillButton({ children, selected=false, onClick, variant='default', tone='quiet', count, dot=true, className='', ...props }) {
  return <button {...props} type={props.type||'button'} className={`lib-pill-button ${selected?'selected':''} ${className}`} data-variant={variant} data-tone={tone} aria-pressed={selected} onClick={onClick}>
    {variant==='quiet'?(dot&&<span className="ct-filter-chip-dot" aria-hidden="true"/>):selected&&<Check size={13}/>}
    <span>{children}</span>{count!==undefined&&<span className="ct-filter-chip-count">{count.toLocaleString()}</span>}
  </button>;
}
export { TagInput } from './TagInput.js';
export { DeptTile } from "./DeptTile.js";
/** @param {{date:string|number|Date,format?:"datetime"|"date"|"time",locale?:string}} props */
export function Timestamp({ date,format="datetime",locale="en-GB" }) {
  const d = new Date(date);
  if(Number.isNaN(d.getTime()))return <span className="lib-timestamp">Date unavailable</span>;
  if(format!=='datetime')return <time className="lib-timestamp" dateTime={d.toISOString()} title={d.toLocaleString(locale)}>{format==='date'?<CalendarDays size={13} aria-hidden="true"/>:<Clock3 size={13} aria-hidden="true"/>}<span>{format==='date'?d.toLocaleDateString(locale,{day:'numeric',month:'long'}):d.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'})}</span></time>;
  return (
    <time
      className="lib-timestamp"
      dateTime={d.toISOString()}
      title={d.toLocaleString()}
    >
      <Clock3 size={13} aria-hidden="true" />
      <span>
        {d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </span>
      <span className="timestamp-divider" aria-hidden="true" />
      <span className="timestamp-time">
        {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </time>
  );
}
/** @param {{color?: string, children?: React.ReactNode}} props */
export function LegendDot({ color = "var(--chart-1)", children }) {
  return (
    <span className="lib-legend">
      <i style={{ background: color }} />
      {children}
    </span>
  );
}
/** @param {Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {title?: React.ReactNode, description?: React.ReactNode, action?: React.ReactNode, tone?: string}} props */
export function Panel({ title, description, action, children, className = "", tone = "default", ...props }) {
  return (
    <section {...props} data-tone={tone} className={`lib-panel ct-panel ${className}`}>
      {title && (
        <SectionHead title={title} sub={description}>
          {action}
        </SectionHead>
      )}
      <div className="ct-panel-content">{children}</div>
    </section>
  );
}
export const Card = Panel;
/** @param {{children?: React.ReactNode}} props */
export function Rows({ children }) {
  return <div className="lib-rows">{children}</div>;
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, leading?: React.ReactNode, trailing?: React.ReactNode, onClick?: React.MouseEventHandler<HTMLButtonElement>}} props */
export function Row({ title, description, leading, trailing, onClick }) {
  const content = (
    <>
      {leading}
      <span className="lib-row-copy">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>
    </>
  );
  return onClick ? (
    <div className="lib-row lib-row-interactive"><button type="button" className="lib-row-open" onClick={onClick}>{content}</button>{trailing}<ChevronRight className="lib-row-chevron" size={14} aria-hidden="true"/></div>
  ) : (
    <div className="lib-row">{content}{trailing}</div>
  );
}
/** @param {React.HTMLAttributes<HTMLDListElement> & {items: ReadonlyArray<ReadonlyArray<React.ReactNode>>}} props */
export function Facts({ items, className = "", ...props }) {
  return (
    <dl {...props} className={`ct-facts ${className}`}>
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
/** @param {{label: React.ReactNode, value: React.ReactNode, hint?: React.ReactNode}} props */
export function Stat({ label, value, hint }) {
  return (
    <div className="lib-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}
/** @param {{children?: React.ReactNode}} props */
export function StatRow({ children }) {
  return <div className="lib-stat-row">{children}</div>;
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, meta?: React.ReactNode, media?: React.ReactNode, footer?: React.ReactNode, onClick?: React.MouseEventHandler<HTMLButtonElement>}} props */
export function CollectionCard({ title, description, meta, media, footer, onClick }) {
  const content = <>
    {media !== undefined ? <span className="lib-collection-card-media">{media}</span> : <span className="lib-card-symbol"><Folder size={23} /></span>}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
  </>;
  // Keep footer actions outside the primary button, so links and menus never nest buttons.
  if (footer !== undefined) return <article className="lib-collection-card" data-slots="true">
    {onClick ? <button type="button" className="lib-collection-card-main" onClick={onClick}>{content}</button> : <div className="lib-collection-card-main">{content}</div>}
    <footer>{footer}</footer>
  </article>;
  return <button type="button" className="lib-collection-card" onClick={onClick}>
    {content}
    <footer><span>{meta}</span><ArrowUpRight size={16} /></footer>
  </button>;
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, icon?: React.ElementType | string, href?: string, external?: boolean, meta?: React.ReactNode, badge?: React.ReactNode, onClick?: React.MouseEventHandler<HTMLElement>}} props */
export function LinkTile({
  title,
  description,
  icon: Icon = BookOpen,
  onClick,
  href,
  external = false,
  meta,
  badge,
}) {
  const Element = href ? "a" : "button";
  return (
    <Element className="lib-link-tile" onClick={onClick} href={href}
      type={href ? undefined : "button"} target={external && href ? "_blank" : undefined}
      rel={external && href ? "noopener noreferrer" : undefined}>
      {typeof Icon === "string" ? <RegistryIcon name={Icon} size={21} /> : <Icon size={21} />}
      <span>
        <strong>{title}</strong>
        {description && <small>{description}</small>}
        {meta && <small>{meta}</small>}
      </span>
      {badge && <span className="ct-link-tile-badge">{badge}</span>}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Element>
  );
}
/** @param {{rows?: number, inline?: boolean, width?: React.CSSProperties['width'], height?: React.CSSProperties['height'], label?: string}} props */
export function Skeleton({ rows = 3, inline = false, width, height, label = "Loading content" }) {
  if (inline) return <span className="lib-skeleton-inline" role="status" aria-label={label} style={{width: width ?? '8ch', height: height ?? '1em'}}><span className="sr-only">{label}</span></span>;
  return (
    <div className="lib-skeleton" role="status" aria-label={label} style={{width, height}}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i}>
          <span />
          <span style={{ width: `${85 - (i % 3) * 12}%` }} />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
/** @param {{value?: number, label?: string}} props */
export function LoadingBar({ value = 45, label = "Loading" }) {
  return (
    <div className="lib-loading">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${value}%` }} />
      </div>
      <span>
        {label} {value}%
      </span>
    </div>
  );
}
/** @param {{busy?: boolean, children?: React.ReactNode}} props */
export function Refreshing({ busy, children }) {
  return (
    <div className={`lib-refreshing ${busy ? "busy" : ""}`} aria-busy={busy}>
      {busy && (
        <span className="lib-refresh-indicator"><Loader label="Refreshing" size={28}/></span>
      )}
      {children}
    </div>
  );
}
/** @param {{state?: string, title?: import('react').ReactNode, description?: import('react').ReactNode, actionLabel?: React.ReactNode, action?: React.ReactNode, onAction?: () => void, onRetry?: () => void, onCreate?: () => void}} props */
export function StateView({ state = "empty", title, description, actionLabel, action, onAction, onRetry, onCreate }) {
  const id = useId();
  const loading = state === "loading", error = state === "error";
  const handleAction = onAction ?? (error ? onRetry : onCreate);
  const heading = title ?? (loading ? "Loading content" : error ? "We couldn’t load this view" : "Nothing here yet");
  const message = description ?? (loading ? "Please wait while we prepare this view." : error ? "Your changes are safe. Try again in a moment." : "Items will appear here when they are added.");
  return <div className="ct-state-view" data-state={loading ? 'loading' : error ? 'error' : 'empty'} role={loading ? 'status' : error ? 'alert' : 'group'} aria-labelledby={`${id}-title`} aria-describedby={`${id}-message`} aria-busy={loading || undefined}>
    <span className="ct-state-glyph" aria-hidden="true">{loading ? <Loader size={20} decorative/> : error ? <Info size={20}/> : <Folder size={20}/>}</span>
    <div className="ct-state-copy"><h3 id={`${id}-title`}>{heading}</h3><p id={`${id}-message`}>{message}</p></div>
    {!loading && (action ?? (handleAction && <Button variant={error ? "" : "primary"} onClick={handleAction}>{actionLabel ?? (error ? "Try again" : onCreate ? "Create project" : "Continue")}</Button>))}
  </div>;
}
/** @param {{children?: React.ReactNode, onClose?: React.MouseEventHandler<HTMLButtonElement>}} props */
export function Toast({ children, onClose }) {
  return (
    <div className="lib-toast" role="status">
      <Check size={17} />
      <span>{children}</span>
      <IconButton label="Dismiss notification" onClick={onClose}>
        <X size={15} />
      </IconButton>
    </div>
  );
}
/** @param {{label: string, children: React.ReactNode}} props */
export function Tooltip({ label, children }) {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  return (
    <span
      className="lib-tooltip"
      data-dismissed={dismissed}
      onMouseEnter={() => setDismissed(false)}
      onFocus={() => setDismissed(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setDismissed(true);
        }
      }}
    >
      {React.cloneElement(children, { "aria-describedby": id })}
      <span role="tooltip" id={id}>
        {label}
      </span>
    </span>
  );
}
/** @param {{trigger: React.ReactElement | ((props: {onClick: () => void, "aria-expanded": boolean}) => React.ReactElement), children?: React.ReactNode | ((close: () => void) => React.ReactNode), label?: string, open?: boolean, onOpenChange?: (open: boolean) => void}} props */
export function Popover({
  trigger,
  children,
  label = "Details",
  open: external,
  onOpenChange,
}) {
  const [own, setOwn] = useState(false),
    open = external ?? own,
    ref = useRef(null),
    anchor = useRef(null),
    id = useId();
  const change = (v) => {
    setOwn(v);
    onOpenChange?.(v);
  };
  useLayoutEffect(() => {
    if (!open) return;
    const p = ref.current;
    const place = () => {
      const r = anchor.current.getBoundingClientRect();
      const rect = p.getBoundingClientRect(),
        width = rect.width || 280,
        height = rect.height || 200;
      const top =
        r.bottom + height + 19 <= window.innerHeight
          ? r.bottom + 7
          : r.top - height - 7;
      p.style.top = `${Math.max(12, Math.min(top, window.innerHeight - height - 12))}px`;
      p.style.left = `${Math.max(12, Math.min(r.left, window.innerWidth - width - 12))}px`;
    };
    p.showPopover?.();
    place();
    const outside = (e) => {
      if (!p.contains(e.target) && !anchor.current.contains(e.target))
        change(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", place);
    const scroll = (e) => {
      if (!(e.target instanceof Node) || !p.contains(e.target)) place();
    };
    window.addEventListener("scroll", scroll, true);
    const first = p.querySelector('button,input,[tabindex="0"]');
    first?.focus();
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", scroll, true);
      try {
        p.hidePopover?.();
      } catch {}
    };
  }, [open]);
  return (
    <span className="lib-popover-anchor" ref={anchor}>
      {React.cloneElement(typeof trigger === "function" ? trigger({onClick: () => change(!open), "aria-expanded": open}) : trigger, {
        "aria-expanded": open,
        "aria-controls": id,
        onClick: () => change(!open),
      })}
      {open && (
        <div
          ref={ref}
          id={id}
          popover="manual"
          className="lib-popover"
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              change(false);
              anchor.current.querySelector("button")?.focus();
            }
            if (e.key === "Tab" && !e.shiftKey) {
              const els = [
                ...ref.current.querySelectorAll(
                  'button,input,a,[tabindex="0"]',
                ),
              ];
              if (e.target === els.at(-1)) change(false);
            }
          }}
        >
          {typeof children === "function"
            ? children(() => {
                change(false);
                anchor.current.querySelector("button")?.focus();
              })
            : children}
        </div>
      )}
    </span>
  );
}
/** @param {{items: DropdownMenuItem[], label?: string, trigger?: React.ComponentProps<typeof Popover>["trigger"], header?: React.ReactNode}} props */
export function DropdownMenu({ items, label = "Actions", trigger, header = undefined }) {
  return (
    <Popover
      label={label}
      trigger={
        trigger || (
          <Button aria-haspopup="menu">
            {label}
            <ChevronDown size={14} />
          </Button>
        )
      }
    >
      {(close) => (
        <div
          role="menu"
          aria-label={label}
          className="lib-menu"
          onKeyDown={(e) => {
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              const options = [
                  ...e.currentTarget.querySelectorAll(
                    "[role=menuitem]:not(:disabled)",
                  ),
                ],
                i = options.indexOf(document.activeElement),
                n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? options.length - 1
                      : (i + (e.key === "ArrowDown" ? 1 : options.length - 1)) %
                        options.length;
              options[n]?.focus();
            }
          }}
        >
          {header && (
            <div className="lib-menu-header" role="presentation">
              {header}
            </div>
          )}
          {items.map((x, index) => x.separator ? <div key={`separator-${index}`} role="separator" className="ct-menu-separator"/> : (
            <button
              role="menuitem"
              key={x.label}
              disabled={x.disabled}
              className={x.danger ? "danger" : ""}
              onClick={() => {
                x.onSelect?.();
                close();
              }}
            >
              {x.icon && (React.isValidElement(x.icon) ? x.icon : <x.icon size={14} />)}
              <span>{x.label}</span>
              {x.shortcut && <kbd>{x.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
/** @param {React.ComponentProps<typeof Modal>} props */
export function Dialog(props) {
  return <Modal {...props} />;
}
/** @param {React.ComponentProps<typeof Modal>} props */
export function Sheet(props) {
  return <Modal {...props} sheet />;
}
/** @param {{open:boolean,onClose:()=>void,onConfirm:()=>void|Promise<void>,title?:import('react').ReactNode,description?:import('react').ReactNode,label?:import('react').ReactNode,confirmLabel?:string,pending?:boolean}} props */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description,
  label,
  confirmLabel = "Confirm",
  pending = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} label={label} description={description} dismissible={!pending}>
      <div className="modal-actions">
        <Button autoFocus variant="quiet" disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={pending} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
/** @param {{children?: React.ReactNode, onConfirm: React.MouseEventHandler<HTMLButtonElement>, onCancel: React.MouseEventHandler<HTMLButtonElement>}} props */
export function ConfirmStrip({ children, onConfirm, onCancel }) {
  return (
    <div className="lib-confirm-strip">
      <p>{children}</p>
      <div>
        <Button variant="quiet" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
/** Static account identity with a separate sign-out action. Legacy items remain accepted for type compatibility.
 * @param {{onSelect?:(label:string)=>void,onLogout?:()=>void,name?:string,initials?:string,workspace?:string,roleCaption?:string,collapsed?:boolean,items?:Array<{id?:string,label?:string,icon?:React.ElementType,onSelect?:()=>void,disabled?:boolean,danger?:boolean,separator?:boolean}>}} props
 */
export function AccountMenu({onSelect,onLogout,name="Alex Morgan",initials="AM",workspace="ARLAB workspace",roleCaption,collapsed=false}) {
 const caption=roleCaption??workspace;
 return <div className="ct-account-menu" data-collapsed={collapsed||undefined}><Avatar initials={initials} name={name} size={30}/>{!collapsed&&<span className="account-identity"><strong>{name}</strong>{caption&&<small>{caption}</small>}</span>}<IconButton className="ct-account-logout" label="Log out" disabled={!onLogout&&!onSelect} onClick={()=>onLogout?onLogout():onSelect?.('Log out')}><RegistryIcon name="LogOut" size={13}/></IconButton></div>;
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, children?: React.ReactNode, defaultOpen?: boolean}} props */
export function Disclosure({
  title,
  description,
  children,
  defaultOpen = false,
}) {
  return (
    <details className="disclosure-card" open={defaultOpen || undefined}>
      <summary>
        <span className="disclosure-symbol">
          <Info size={18} />
        </span>
        <span className="disclosure-heading">
          <strong>{title}</strong>
          {description && <small>{description}</small>}
        </span>
        <ChevronDown size={17} />
      </summary>
      <div className="disclosure-content">{children}</div>
    </details>
  );
}
/** @param {{dirty:boolean,onSave?:()=>void|Promise<void>,onDiscard?:()=>void,saving?:boolean,actions?:import('react').ReactNode,message?:import('react').ReactNode,sticky?:boolean}} props */
export function SaveBar({ dirty, onSave, onDiscard, saving = false, actions = undefined, message = undefined, sticky = false }) {
  return (
    <div className="ct-save-bar" data-sticky={sticky || undefined}>
      <span>
        {message !== undefined ? message : dirty ? (
          <>
            <span className="dirty-dot" />
            Unsaved changes
          </>
        ) : (
          <>
            <Check size={15} />
            All changes saved
          </>
        )}
      </span>
      {actions ? <div className="lib-inline">{actions}</div> : <div className="lib-inline">
        <Button variant="quiet" disabled={!dirty || saving} onClick={onDiscard}>
          Discard
        </Button>
        <Button
          variant="primary"
          disabled={!dirty || saving}
          onClick={onSave}
          aria-busy={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>}
    </div>
  );
}
/** @param {{label: React.ReactNode, hint?: React.ReactNode, children?: React.ReactNode}} props */
export function FieldRow({ label, hint, children }) {
  return (
    <div className="lib-field-row">
      <div>
        <strong>{label}</strong>
        {hint && <p>{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, children?: React.ReactNode}} props */
export function SheetSection({ title, description, children }) {
  return (
    <section className="lib-sheet-section">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}
/** @param {{children: string, onCopy?: (text: string) => Promise<void>, onCopyError?: (error: unknown) => void}} props */
export function CopyBlock({ children, onCopy, onCopyError }) {
  const [copied, setCopied] = useState(false);
  const [error,setError]=useState('');
  return <div className="lib-copy-block">
    <pre><code>{children}</code></pre>
    <Button onClick={async()=>{
      setError('');
      try {
        if(onCopy)await onCopy(children);else await navigator.clipboard.writeText(children);
        setCopied(true);setTimeout(()=>setCopied(false),2000);
      } catch(reason) {
        setCopied(false);setError('Copy unavailable. Select the text and copy it manually.');onCopyError?.(reason);
      }
    }}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy'}</Button>
    {error&&<p role="status">{error}</p>}
  </div>;
}
/** Strings remain supported; object items accept rich labels, real links and individual actions. */
/** @param {{items: BreadcrumbItem[], onNavigate?: (item: BreadcrumbItem) => void, truncate?: boolean}} props */
export function Breadcrumbs({ items, onNavigate, truncate = false }) {
  return <nav className="lib-breadcrumbs" aria-label="Breadcrumb" data-truncate={truncate || undefined}>
    {items.map((item, i) => {
      const entry = typeof item === 'string' ? {label:item} : item;
      const last = i === items.length - 1;
      const tooltip = entry.title ?? (typeof entry.label === 'string' ? entry.label : undefined);
      const activate = event => {
        if(event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
        if(entry.onClick || onNavigate) {event.preventDefault(); entry.onClick ? entry.onClick(event) : onNavigate(item);}
      };
      return <React.Fragment key={entry.id ?? entry.href ?? i}>
        {i > 0 && <ChevronRight size={13} aria-hidden="true"/>}
        {last ? <span aria-current="page" title={truncate ? tooltip : undefined}>{entry.label}</span>
          : entry.href ? <a href={entry.href} onClick={activate} title={tooltip}>{entry.label}</a>
          : entry.onClick || onNavigate ? <button type="button" onClick={activate} title={tooltip}>{entry.label}</button>
          : <span title={tooltip}>{entry.label}</span>}
      </React.Fragment>;
    })}
  </nav>;
}
/** @param {{value:string,onChange:(value:string)=>void,options?:Array<{value:string,label:string,description?:string,icon?:React.ReactNode,disabled?:boolean}>,label?:string,disabled?:boolean}} props */
export function AppSwitcher({value,onChange,options,label="Switch application",disabled=false}) {
 const apps=options ?? [
  {value:'Workspace',label:'Workspace',description:'Projects, people and daily work',icon:<RegistryIcon name="LayoutDashboard" size={14}/>},
  {value:'Agents Studio',label:'Agents Studio',description:'Agents, workflows and connections',icon:<RegistryIcon name="Workflow" size={14}/>},
  {value:'Knowledge',label:'Knowledge',description:'Documents, context and references',icon:<RegistryIcon name="BookOpen" size={14}/>},
 ];
 const selected=apps.find(app=>app.value===value) ?? {value,label:value||'Choose application',icon:<RegistryIcon name="Grid2X2" size={14}/>};
 return <div className="lib-app-switcher"><Popover label={label} trigger={<button type="button" className="ct-app-switcher-trigger" disabled={disabled} aria-label={`${label}: ${selected.label}`} aria-haspopup="menu"><span className="ct-app-switcher-glyph">{selected.icon??<RegistryIcon name="Grid2X2" size={14}/>}</span><strong>{selected.label}</strong><ChevronDown size={12} aria-hidden="true"/></button>}>
  {close=><div className="ct-app-switcher-menu" role="menu" aria-label={label} onKeyDown={event=>{
   if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
   event.preventDefault();const buttons=Array.from(event.currentTarget.querySelectorAll('button:not(:disabled)'));const at=buttons.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowDown'?1:buttons.length-1))%buttons.length;buttons[next]?.focus();
  }}><div className="ct-app-switcher-caption">Applications</div>{apps.map(app=><button type="button" key={app.value} role="menuitemradio" aria-checked={value===app.value} disabled={app.disabled} onClick={()=>{onChange(app.value);close();}}><span className="ct-app-switcher-glyph">{app.icon??<RegistryIcon name="Grid2X2" size={14}/>}</span><span><strong>{app.label}</strong>{app.description&&<small>{app.description}</small>}</span></button>)}</div>}
 </Popover></div>;
}
/** @param {{items: Array<{label: string, children: string[]}>, value: string, onChange: (value: string) => void}} props */
export function NavTree({ items, value, onChange }) {
  return (
    <nav className="lib-nav-tree" aria-label="Document navigation">
      {items.map((group) => (
        <details key={group.label} open>
          <summary>
            <ChevronRight size={14} />
            <Folder size={15} />
            {group.label}
          </summary>
          {group.children.map((x) => (
            <button
              key={x}
              aria-current={value === x ? "page" : undefined}
              onClick={() => onChange(x)}
            >
              <FileText size={14} />
              {x}
            </button>
          ))}
        </details>
      ))}
    </nav>
  );
}
/** @param {{title:import('react').ReactNode,showTitle?:boolean,description?:import('react').ReactNode,actions?:import('react').ReactNode,pills?:import('react').ReactNode,updated?:import('react').ReactNode,pillsPlacement?:'below'|'inline',heading?:'h1'|'h2'|'h3'|'h4'|'h5'|'h6'}} props */
export function PageBar({ title, showTitle = true, description, actions, pills = undefined, updated = undefined, pillsPlacement = "below", heading: Heading = "h2" }) {
  return (
    <header className="lib-pagebar" data-title-hidden={!showTitle||undefined}>
      <div>
        {pillsPlacement === 'inline' ? <div className="ct-pagebar-title"><Heading className={showTitle?undefined:"sr-only"}>{title}</Heading>{pills&&<div className="ct-pagebar-pills">{pills}</div>}</div> : <Heading className={showTitle?undefined:"sr-only"}>{title}</Heading>}
        {updated ? <div className="ct-pagebar-summary">{description&&<p>{description}</p>}<div className="ct-pagebar-updated">{updated}</div></div> : description&&<p>{description}</p>}
        {pills && pillsPlacement !== 'inline' && <div className="ct-pagebar-pills">{pills}</div>}
      </div>
      {actions}
    </header>
  );
}
/** @param {{children?: React.ReactNode}} props */
export function PageGrid({ children }) {
  return <div className="lib-page-grid">{children}</div>;
}
/** @param {{children?: React.ReactNode}} props */
export function CardGrid({ children }) {
  return <div className="lib-card-grid">{children}</div>;
}
/** @param {import('react').HTMLAttributes<HTMLDivElement> & {gap?:import('react').CSSProperties['gap']}} props */
export function Stack({ children, gap = 16, className = '', style, ...props }) {
  return (
    <div {...props} className={`lib-stack ${className}`} style={{gap,...style}}>
      {children}
    </div>
  );
}
/** @param {{title: React.ReactNode, description?: React.ReactNode, status?: React.ReactNode, children?: React.ReactNode}} props */
export function DetailHeader({ title, description, status, children }) {
  return (
    <div className="lib-detail-header">
      <div>
        <Status>{status}</Status>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export { SidebarShell } from "./SidebarShell.js";
/** @param {{title?: React.ReactNode, description?: React.ReactNode, action?: React.ReactNode, fine?: React.ReactNode, onContinue?: React.MouseEventHandler<HTMLButtonElement>}} props */
export function Gate({ title = "A familiar place to work.", description = "Sign in with your team account to open the ARLAB workspace.", action, fine, onContinue }) {
  return (
    <div className="lib-gate">
      <Logo />
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action ?? <Button variant="primary" onClick={onContinue}>Continue with work account</Button>}
      {fine && <small>{fine}</small>}
    </div>
  );
}
/** @param {{query: string, onQueryChange: (value: string) => void, status: string, onStatusChange: (value: string) => void}} props */
export function FilterRow({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="lib-filter-row">
      <SearchField
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        label="Search projects"
      />
      <Dropdown
        aria-label="Project status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        options={["All statuses", "In progress", "In review", "Planning"].map(
          (label) => ({ value: label, label }),
        )}
      />
      {(query || status !== "All statuses") && (
        <Button
          variant="quiet"
          onClick={() => {
            onQueryChange("");
            onStatusChange("All statuses");
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
/** @param {{label: React.ReactNode, direction?: "none"|"ascending"|"descending", onSort?: React.MouseEventHandler<HTMLButtonElement>}} props */
export function SortHead({ label, direction = "none", onSort }) {
  return (
    <th className="ct-sort-head" scope="col" aria-sort={direction}>
      <SortControl label={label} direction={direction} onSort={onSort}/>
    </th>
  );
}
/** @param {{rows: ProjectRecord[], onOpen?: (row: ProjectRecord) => void}} props */
export function DataTable({ rows, onOpen }) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All statuses"),
    [sort, setSort] = useState("name"),
    [ascending, setAscending] = useState(true),
    [selected, setSelected] = useState([]),
    [page, setPage] = useState(0);
  const all = rows
      .filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) &&
          (status === "All statuses" || r.status === status),
      )
      .sort(
        (a, b) =>
          (ascending ? 1 : -1) *
          (sort === "progress"
            ? a.progress - b.progress
            : a[sort].localeCompare(b[sort])),
      ),
    pages = Math.max(1, Math.ceil(all.length / 4)),
    current = Math.min(page, pages - 1),
    visible = all.slice(current * 4, current * 4 + 4);
  const toggle = (id) =>
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  return (
    <div className="lib-data-table">
      <FilterRow
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setPage(0);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(0);
        }}
      />
      {selected.length > 0 && (
        <div className="lib-bulk" role="status">
          <span>{selected.length} selected</span>
          <Button variant="quiet" onClick={() => setSelected([])}>
            Clear selection
          </Button>
        </div>
      )}
      <ScrollArea
        className="table-scroll"
        label="Projects table"
        axis="both"
        maxHeight={420}
      >
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox
                  label={<span className="sr-only">Select visible rows</span>}
                  checked={
                    visible.length > 0 &&
                    visible.every((r) => selected.includes(r.id))
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [
                            ...new Set([
                              ...selected,
                              ...visible.map((r) => r.id),
                            ]),
                          ]
                        : selected.filter(
                            (id) => !visible.some((r) => r.id === id),
                          ),
                    )
                  }
                />
              </th>
              {[
                ["name", "Project"],
                ["status", "Status"],
                ["progress", "Progress"],
              ].map(([key, label]) => (
                <SortHead key={key} label={label}
                  direction={sort===key?(ascending?'ascending':'descending'):'none'}
                  onSort={()=>{setAscending(sort===key?!ascending:true);setSort(key);}}/>

              ))}
              <th>
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.id}
                className={selected.includes(r.id) ? "selected" : ""}
              >
                <td>
                  <Checkbox
                    label={<span className="sr-only">Select {r.name}</span>}
                    checked={selected.includes(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                </td>
                <td>
                  <strong>{r.name}</strong>
                  <small>{r.client}</small>
                </td>
                <td>
                  <Status>{r.status}</Status>
                </td>
                <td>
                  <Meter value={r.progress} label={`${r.name} completion`} />
                </td>
                <td>
                  <IconButton
                    label={`Open ${r.name}`}
                    onClick={() => onOpen?.(r)}
                  >
                    <ChevronRight size={16} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      {!all.length && (
        <EmptyState
          title="No projects match"
          description="Try a broader search or reset the filters."
        />
      )}
      <div className="lib-pagination">
        <span>{all.length} projects</span>
        <span>
          Page {current + 1} of {pages}
        </span>
        <IconButton
          label="Previous page"
          disabled={current === 0}
          onClick={() => setPage(current - 1)}
        >
          <ChevronLeft size={16} />
        </IconButton>
        <IconButton
          label="Next page"
          disabled={current === pages - 1}
          onClick={() => setPage(current + 1)}
        >
          <ChevronRight size={16} />
        </IconButton>
      </div>
    </div>
  );
}
/** @param {{items?: ProjectRecord[]}} props */
export function Inspector({ items = [] }) {
  const [selected, setSelected] = useState(items[0]?.id),
    [query, setQuery] = useState("");
  const current = items.find((i) => i.id === selected);
  return (
    <div className="lib-inspector">
      <aside>
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          label="Filter items"
        />
        {items
          .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
          .map((i) => (
            <button
              key={i.id}
              aria-pressed={i.id === selected}
              onClick={() => setSelected(i.id)}
            >
              <FileText size={17} />
              <span>
                {i.name}
                <small>{i.client}</small>
              </span>
              <ChevronRight size={14} />
            </button>
          ))}
      </aside>
      <article>
        <DetailHeader
          title={current.name}
          description={current.client}
          status={current.status}
        />
        <Facts
          items={[
            ["Owner", current.owner],
            ["Due date", current.due],
            ["Completion", `${current.progress}%`],
          ]}
        />
        <p>The selected record stays connected to its place in the list.</p>
      </article>
    </div>
  );
}
/** @param {{items: Array<{id?: string, title: React.ReactNode, description?: React.ReactNode, time?: React.ReactNode, tone?: 'ok'|'warn'|'bad'|'info'|'quiet', meta?: React.ReactNode, actions?: React.ReactNode}>}} props */
export function Timeline({ items }) {
  return (
    <ol className="lib-timeline">
      {items.map((x, i) => (
        <li key={x.id ?? i} data-tone={x.tone}>
          <span className="timeline-dot" />
          <div>
            <strong>{x.title}</strong>
            {x.description && <p>{x.description}</p>}
            {x.meta && <p className="ct-timeline-meta">{x.meta}</p>}
            {x.time && <time>{x.time}</time>}
            {x.actions && <div className="ct-timeline-actions">{x.actions}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
/** @param {{steps: string[], current?: number, onChange?: (step: number) => void}} props */
export function Steps({ steps, current = 0, onChange }) {
  return (
    <ol className="lib-steps">
      {steps.map((label, i) => (
        <li key={label}>
          <button
            aria-current={current === i ? "step" : undefined}
            onClick={() => onChange?.(i)}
          >
            <span>{i < current ? <Check size={14} /> : i + 1}</span>
            <strong>{label}</strong>
          </button>
        </li>
      ))}
    </ol>
  );
}
/**
 * @param {{title?: React.ReactNode, children?: React.ReactNode, value?: unknown, v?: unknown, emptyLabel?: React.ReactNode, maxDepth?: number}} props
 */
export function ReadableDoc({ title, children, value, v, emptyLabel = "None", maxDepth = 12 }) {
  const seen = new WeakSet();
  const renderValue = (entry, depth = 0) => {
    if (entry === null || entry === undefined || entry === "") return <span className="ct-doc-empty">{emptyLabel}</span>;
    if (typeof entry !== "object") return <span>{String(entry)}</span>;
    if (depth >= maxDepth) return <span className="ct-doc-empty">More nested content</span>;
    if (seen.has(entry)) return <span className="ct-doc-empty">Circular reference</span>;
    seen.add(entry);
    let content;
    if (entry instanceof Date) content = <span>{Number.isNaN(entry.getTime()) ? emptyLabel : entry.toISOString()}</span>;
    else if (Array.isArray(entry)) content = entry.length ? <ul className="ct-doc-list">{entry.map((item, index) => <li key={index}>{renderValue(item, depth + 1)}</li>)}</ul> : <span className="ct-doc-empty">{emptyLabel}</span>;
    else {
      const entries = Object.entries(entry);
      content = entries.length ? <dl className="ct-doc-fields">{entries.map(([key, item]) => <div key={key}><dt>{key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, letter => letter.toUpperCase())}</dt><dd>{renderValue(item, depth + 1)}</dd></div>)}</dl> : <span className="ct-doc-empty">{emptyLabel}</span>;
    }
    seen.delete(entry);
    return content;
  };
  const structured = value !== undefined || v !== undefined;
  return <article className="lib-readable">{title && <h2>{title}</h2>}{structured ? renderValue(value !== undefined ? value : v) : children}</article>;
}
function safeMarkdownHref(href) {
  const candidate = href.trim();
  if (!candidate || /[\u0000-\u0020\u007f]/.test(candidate)) return undefined;
  if (/^(?:https?:|mailto:)/i.test(candidate)) return candidate;
  if (/^[a-z][a-z\d+.-]*:/i.test(candidate) || candidate.startsWith('\\')) return undefined;
  return candidate;
}
function markdownInline(source) {
  return source.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{markdownInline(part.slice(2, -2))}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) { const href = safeMarkdownHref(link[2]); return href ? <a key={index} href={href}>{markdownInline(link[1])}</a> : <React.Fragment key={index}>{link[1]}</React.Fragment>; }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
/** Safe text-only Markdown: headings, lists, fenced code, bold, inline code and links. Raw HTML stays text. @param {{children: string}} props */
export function Markdown({ children }) {
  const segments = children.replace(/\r\n/g, '\n').split(/(```[^\n]*\n[\s\S]*?\n```)/g);
  return <div className="lib-markdown">{segments.flatMap((segment, section) => {
    if (segment.startsWith('```')) return <pre key={`code-${section}`}><code>{segment.replace(/^```[^\n]*\n|\n```$/g, '')}</code></pre>;
    return segment.split(/\n\s*\n/).filter(block => block.trim()).map((block, index) => {
      const key = `${section}-${index}`;
      const heading = block.match(/^(#{1,3}) (.+)$/);
      if (heading) return React.createElement(`h${heading[1].length + 1}`, {key}, markdownInline(heading[2]));
      if (block.split('\n').every(line => /^- /.test(line))) return <ul key={key}>{block.split('\n').map((line, item) => <li key={item}>{markdownInline(line.slice(2))}</li>)}</ul>;
      if (block.split('\n').every(line => /^\d+\. /.test(line))) return <ol key={key}>{block.split('\n').map((line, item) => <li key={item}>{markdownInline(line.replace(/^\d+\. /, ''))}</li>)}</ol>;
      return <p key={key}>{markdownInline(block)}</p>;
    });
  })}</div>;
}
/** @param {{items: Array<{id: string, label: React.ReactNode}>}} props */
export function Toc({ items }) {
  return (
    <nav className="lib-toc" aria-label="On this page">
      <strong>On this page</strong>
      {items.map((x) => (
        <a key={x.id} href={`#${x.id}`}>
          {x.label}
        </a>
      ))}
    </nav>
  );
}
const chartData = [
  { label: "Mon", value: 18 },
  { label: "Tue", value: 26 },
  { label: "Wed", value: 21 },
  { label: "Thu", value: 34 },
  { label: "Fri", value: 29 },
];
/** @typedef {{label: string, value: number}} ChartPoint */
/** @param {{data: ChartPoint[], secondaryData?: ChartPoint[], primaryLabel?: string, secondaryLabel?: string}} props */
function ChartTable({ data, secondaryData, primaryLabel = "Value", secondaryLabel = "Comparison" }) {
  const secondary = new Map(secondaryData?.map(point => [point.label, point.value]));
  return (
    <details className="lib-chart-table">
      <summary>View data table</summary>
      <table>
        <thead><tr><th scope="col">Category</th><th scope="col">{primaryLabel}</th>{secondaryData && <th scope="col">{secondaryLabel}</th>}</tr></thead>
        <tbody>{data.map(d => <tr key={d.label}><th scope="row">{d.label}</th><td>{d.value}</td>{secondaryData && <td>{secondary.get(d.label) ?? 'Not available'}</td>}</tr>)}</tbody>
      </table>
    </details>
  );
}
/** @param {{data?: ChartPoint[], secondaryData?: ChartPoint[], primaryLabel?: string, secondaryLabel?: string}} props */
export function ColumnChart({ data = chartData, secondaryData, primaryLabel = "Value", secondaryLabel = "Comparison" }) {
  const secondary = new Map(secondaryData?.map(point => [point.label, point.value]));
  const max = Math.max(...data.flatMap(d => [d.value, secondary.get(d.label) ?? 0]), 1);
  return (
    <div className="lib-chart">
      <div className="lib-columns" role="img" aria-label={data.map(d => `${d.label}: ${primaryLabel} ${d.value}${secondaryData ? `, ${secondaryLabel} ${secondary.get(d.label) ?? 'not available'}` : ''}`).join(", ")}>
        {data.map((d, i) => <div key={d.label}>
          <strong>{d.value}</strong>
          {secondaryData ? <div className="lib-column-pair">
            <span style={{height: `${Math.max(0, d.value / max) * 125}px`, background: 'var(--chart-1)'}} />
            <span style={{height: `${Math.max(0, (secondary.get(d.label) ?? 0) / max) * 125}px`, background: 'var(--chart-2)'}} />
          </div> : <span style={{height: `${Math.max(0, d.value / max) * 125}px`, background: `var(--chart-${(i % 6) + 1})`}} />}
          <small>{d.label}</small>
        </div>)}
      </div>
      {secondaryData && <div className="lib-chart-legend"><LegendDot color="var(--chart-1)">{primaryLabel}</LegendDot><LegendDot color="var(--chart-2)">{secondaryLabel}</LegendDot></div>}
      <ChartTable data={data} secondaryData={secondaryData} primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />
    </div>
  );
}
/** @param {{data?: ChartPoint[], secondaryData?: ChartPoint[], primaryLabel?: string, secondaryLabel?: string}} props */
export function Sparkline({ data = chartData, secondaryData, primaryLabel = "Value", secondaryLabel = "Comparison" }) {
  const secondary = new Map(secondaryData?.map(point => [point.label, point.value]));
  const max = Math.max(...data.flatMap(d => [d.value, secondary.get(d.label) ?? 0]), 1);
  const x = index => 20 + (index * 260) / Math.max(1, data.length - 1);
  const y = value => 90 - (value / max) * 70;
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  let previousPresent = false;
  const comparisonPath = data.map((d, i) => {
    const value = secondary.get(d.label);
    if (value === undefined) {previousPresent = false; return '';}
    const command = previousPresent ? 'L' : 'M'; previousPresent = true;
    return `${command}${x(i)} ${y(value)}`;
  }).join(' ');
  return <div className="lib-chart">
    <svg className="lib-sparkline" role="img" aria-label={data.map(d => `${d.label}: ${primaryLabel} ${d.value}${secondaryData ? `, ${secondaryLabel} ${secondary.get(d.label) ?? 'not available'}` : ''}`).join(", ")} viewBox="0 0 300 110">
      <path d="M20 90h260" stroke="var(--line)" />
      <polyline points={points} fill="none" stroke="var(--chart-trend)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      {secondaryData && <path d={comparisonPath} fill="none" stroke="var(--chart-2)" strokeWidth="1.25" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />}
      {data.map((d, i) => <circle key={d.label} cx={x(i)} cy={y(d.value)} r="1.75" fill="var(--raise)" stroke="var(--chart-trend)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
    </svg>
    {secondaryData && <div className="lib-chart-legend"><LegendDot color="var(--chart-trend)">{primaryLabel}</LegendDot><LegendDot color="var(--chart-2)">{secondaryLabel}</LegendDot></div>}
    <ChartTable data={data} secondaryData={secondaryData} primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />
  </div>;
}
export function StackedBar({ data = chartData }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div className="lib-chart">
      <div
        className="lib-stacked"
        role="img"
        aria-label={data.map((d) => `${d.label}: ${d.value}`).join(", ")}
      >
        {data.map((d, i) => (
          <span
            key={d.label}
            title={`${d.label}: ${d.value}`}
            style={{
              width: `${total > 0 ? (d.value / total) * 100 : 0}%`,
              background: `var(--chart-${(i % 6) + 1})`,
            }}
          />
        ))}
      </div>
      <div className="lib-chart-legend">
        {data.map((d, i) => (
          <LegendDot key={d.label} color={`var(--chart-${(i % 6) + 1})`}>
            {d.label} {d.value}
          </LegendDot>
        ))}
      </div>
      <ChartTable data={data} />
    </div>
  );
}
export function BarList({ data = chartData }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="lib-bar-list">
      {data.map((d, i) => (
        <div key={d.label}>
          <span>{d.label}</span>
          <span>
            <i
              style={{
                width: `${(d.value / max) * 100}%`,
                background: `var(--chart-${(i % 6) + 1})`,
              }}
            />
          </span>
          <strong>{d.value}</strong>
        </div>
      ))}
    </div>
  );
}
export { Calendar } from "./Calendar.js";
/** @typedef {{id: string, time: string, title: string, description?: React.ReactNode, href?: string, state?: 'past'|'late'|'secondary'}} DayTimelineItem
 * @param {{date?: string | Date, items?: DayTimelineItem[], onSelect?: (name: string, item: DayTimelineItem) => void, empty?: React.ReactNode, timezone?: string, days?: {value: string, label: string, disabled?: boolean}[], value?: string, onChange?: (value: string) => void}} props
 */
export function DayTimeline({date, items = [], onSelect, empty = "Nothing scheduled for this day.", timezone, days, value, onChange}) {
  const dateValue = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`) : date ? new Date(date) : null;
  const heading = dateValue && Number.isFinite(dateValue.getTime()) ? dateValue.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'}) : 'Schedule';
  return <div className="lib-day-timeline">
    <header><CalendarDays size={17}/><strong>{heading}</strong>{timezone && <span>{timezone}</span>}</header>
    {days?.length ? <nav className="ct-day-strip" aria-label="Schedule days">{days.map(day => <button key={day.value} type="button" aria-pressed={day.value === value} disabled={day.disabled} onClick={() => onChange?.(day.value)}>{day.label}</button>)}</nav> : null}
    {items.length ? items.map(item => <div key={item.id} data-state={item.state}>
      <time>{item.time}</time><div>{item.href
        ? <a href={item.href} onClick={() => onSelect?.(item.title,item)}><strong>{item.title}</strong>{item.description && <small>{item.description}</small>}</a>
        : onSelect ? <button type="button" onClick={() => onSelect(item.title,item)}><strong>{item.title}</strong>{item.description && <small>{item.description}</small>}</button>
        : <article><strong>{item.title}</strong>{item.description && <small>{item.description}</small>}</article>}
      </div></div>) : <p className="ct-day-empty">{empty}</p>}
  </div>;
}
export { KanbanBoard } from './KanbanBoard.js';
/** @param {{open: boolean, onClose: () => void, project: ProjectRecord, onSave: (project: ProjectRecord) => void}} props */
export function ProjectStatusSheet({ open, onClose, project, onSave }) {
  const [status, setStatus] = useState(project.status);
  useEffect(() => {
    if (open) setStatus(project.status);
  }, [open, project.id, project.status]);
  return (
    <Sheet open={open} onClose={onClose} title="Project status">
      <DetailHeader
        title={project.name}
        description={project.client}
        status={status}
      />
      <Facts
        items={[
          ["Owner", project.owner],
          ["Delivery", project.due],
        ]}
      />
      <Field label="Status">
        <Dropdown
          aria-label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={["Planning", "In progress", "In review", "Completed"].map(
            (label) => ({ label, value: label }),
          )}
        />
      </Field>
      <div className="modal-actions">
        <Button variant="quiet" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => onSave({ ...project, status })}
        >
          Save status
        </Button>
      </div>
    </Sheet>
  );
}

export { AppHeader } from './AppHeader.js';
