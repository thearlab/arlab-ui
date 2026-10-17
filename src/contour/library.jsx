import { Input, Textarea } from "./BaseFields.js";
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
export const Pill = Status;
export const StatusPill = Status;
export const Dropzone = FileUpload;
export const Select = Dropdown;
export const Picker = Dropdown;
export function ComboboxPicker(props) {
  return <Dropdown {...props} searchable />;
}
export function TextLink({ children, ...props }) {
  return (
    <a className="lib-text-link" {...props}>
      {children}
    </a>
  );
}
export function Kbd({ children }) {
  return <kbd>{children}</kbd>;
}
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
export function Checkbox({ label, hint, ...props }) {
  return (
    <label className="lib-choice">
      <input type="checkbox" {...props} />
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}
export function Radio({ label, ...props }) {
  return (
    <label className="lib-choice">
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function Switch({ label = undefined, hint = undefined, ...props }) {
  return (
    <label className="switch-row">
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
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
export function SegmentedControl({ options, value, onChange, label = "View" }) {
  return (
    <div className="segments" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} aria-pressed={value === o} onClick={() => onChange(o)}>
          {o}
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
export function Chip({ children, onRemove }) {
  return (
    <span className="removable-tag">
      {children}
      {onRemove && (
        <IconButton label={`Remove ${children}`} onClick={onRemove}>
          <X size={12} />
        </IconButton>
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
export function Timestamp({ date }) {
  const d = new Date(date);
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
export function LegendDot({ color = "var(--chart-1)", children }) {
  return (
    <span className="lib-legend">
      <i style={{ background: color }} />
      {children}
    </span>
  );
}
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
export function Rows({ children }) {
  return <div className="lib-rows">{children}</div>;
}
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
export function Stat({ label, value, hint }) {
  return (
    <div className="lib-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function StatRow({ children }) {
  return <div className="lib-stat-row">{children}</div>;
}
export function CollectionCard({ title, description, meta, onClick }) {
  return (
    <button className="lib-collection-card" onClick={onClick}>
      <span className="lib-card-symbol">
        <Folder size={23} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <footer>
        <span>{meta}</span>
        <ArrowUpRight size={16} />
      </footer>
    </button>
  );
}
export function LinkTile({
  title,
  description,
  icon: Icon = BookOpen,
  onClick,
}) {
  return (
    <button className="lib-link-tile" onClick={onClick}>
      <Icon size={21} />
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <ArrowUpRight size={17} />
    </button>
  );
}
export function Skeleton({ rows = 3 }) {
  return (
    <div className="lib-skeleton" role="status" aria-label="Loading content">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i}>
          <span />
          <span style={{ width: `${85 - (i % 3) * 12}%` }} />
        </div>
      ))}
      <span className="sr-only">Loading content</span>
    </div>
  );
}
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
export function Refreshing({ busy, children }) {
  return (
    <div className={`lib-refreshing ${busy ? "busy" : ""}`} aria-busy={busy}>
      {busy && (
        <span className="lib-refresh-label" role="status">
          Refreshing…
        </span>
      )}
      {children}
    </div>
  );
}
/** @param {{state?: string, title?: import('react').ReactNode, description?: import('react').ReactNode, onRetry?: () => void, onCreate?: () => void}} props */
export function StateView({ state = "empty", title, description, onRetry, onCreate }) {
  if (state === "loading") return <Skeleton />;
  const error = state === "error";
  const action = error ? onRetry : onCreate;
  return (
    <EmptyState
      title={title ?? (error ? "We couldn’t load your projects" : "A place for your next idea")}
      description={description ?? (error ? "Your work is safe. Check your connection and try again." : "Create a project to bring your team and ideas together.")}
    >
      {action && <Button variant={error ? "" : "primary"} onClick={action}>
        {error ? "Try again" : "Create project"}
      </Button>}
    </EmptyState>
  );
}
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
export function Dialog(props) {
  return <Modal {...props} />;
}
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
/** App-owned actions run through each item's onSelect; omitted items retain demo compatibility.
 * roleCaption overrides workspace in both the trigger and signed-in menu header.
 * collapsed retains the accessible name and full menu while hiding trigger copy.
 * @param {{onSelect?:(label:string)=>void,name?:string,initials?:string,workspace?:string,roleCaption?:string,collapsed?:boolean,items?:Array<{id?:string,label?:string,icon?:React.ElementType,onSelect?:()=>void,disabled?:boolean,danger?:boolean,separator?:boolean}>}} props
 */
export function AccountMenu({
  onSelect,
  name = "Alex Morgan",
  initials = "AM",
  workspace = "ARLAB workspace",
  roleCaption,
  collapsed = false,
  items,
}) {
  const caption = roleCaption ?? workspace;
  const actions = items ?? [
    { label: "Your profile", icon: User, onSelect: () => onSelect?.("Your profile") },
    { label: "Workspace settings", icon: Settings2, onSelect: () => onSelect?.("Workspace settings") },
    { label: "Help and support", icon: BookOpen, onSelect: () => onSelect?.("Help and support") },
  ];
  return (
    <span className="ct-account-menu" data-collapsed={collapsed || undefined}>
    <DropdownMenu
      label="Account menu"
      trigger={
        <button type="button" className="account-trigger" aria-label={`Account menu for ${name}`} aria-haspopup="menu" title={collapsed ? name : undefined}>
          <Avatar initials={initials} name={name} />
          {!collapsed && <><span className="account-identity"><strong>{name}</strong>{caption && <small>{caption}</small>}</span>
          <span className="account-chevron"><ChevronDown size={12} aria-hidden="true" /></span></>}
        </button>
      }
      header={<><span>Signed in as</span><strong>{name}</strong>{caption && <small>{caption}</small>}</>}
      items={actions}
    />
    </span>
  );
}
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
export function AppSwitcher({ value, onChange }) {
  return (
    <div className="lib-app-switcher" role="group" aria-label="Application">
      {["Workspace", "Agents Studio", "Knowledge"].map((x) => (
        <button key={x} aria-pressed={x === value} onClick={() => onChange(x)}>
          {x === "Workspace" ? (
            <Folder size={16} />
          ) : x === "Knowledge" ? (
            <BookOpen size={16} />
          ) : (
            <Settings2 size={16} />
          )}
          <span>{x}</span>
        </button>
      ))}
    </div>
  );
}
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
export function PageGrid({ children }) {
  return <div className="lib-page-grid">{children}</div>;
}
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
export function Gate({ onContinue }) {
  return (
    <div className="lib-gate">
      <Logo />
      <h2>A familiar place to work.</h2>
      <p>Sign in with your team account to open the ARLAB workspace.</p>
      <Button variant="primary" onClick={onContinue}>
        Continue with work account
      </Button>
      <small>Demo access only. No authentication request is sent.</small>
    </div>
  );
}
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
export function SortHead({ label, direction = "none", onSort }) {
  return (
    <th aria-sort={direction}>
      <button type="button" onClick={onSort}>
        {label}
        <ArrowUpDown size={13} aria-hidden="true" />
      </button>
    </th>
  );
}
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
                <th
                  key={key}
                  aria-sort={
                    sort === key
                      ? ascending
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    onClick={() => {
                      setAscending(sort === key ? !ascending : true);
                      setSort(key);
                    }}
                  >
                    {label}
                    <ArrowUpDown size={13} />
                  </button>
                </th>
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
export function Timeline({ items }) {
  return (
    <ol className="lib-timeline">
      {items.map((x, i) => (
        <li key={i}>
          <span className="timeline-dot" />
          <div>
            <strong>{x.title}</strong>
            <p>{x.description}</p>
            <time>{x.time}</time>
          </div>
        </li>
      ))}
    </ol>
  );
}
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
export function ReadableDoc({ title, children }) {
  return (
    <article className="lib-readable">
      <h2>{title}</h2>
      {children}
    </article>
  );
}
export function Markdown({ children }) {
  const blocks = children.split(/\n\n+/);
  return (
    <div className="lib-markdown">
      {blocks.map((b, i) =>
        b.startsWith("### ") ? (
          <h4 key={i}>{b.slice(4)}</h4>
        ) : b.startsWith("## ") ? (
          <h3 key={i}>{b.slice(3)}</h3>
        ) : b.startsWith("# ") ? (
          <h2 key={i}>{b.slice(2)}</h2>
        ) : b.startsWith("- ") ? (
          <ul key={i}>
            {b.split("\n").map((line, j) => (
              <li key={j}>{line.replace(/^- /, "")}</li>
            ))}
          </ul>
        ) : b.startsWith("```") ? (
          <pre key={i}>
            <code>{b.replace(/^```[^\n]*\n?|\n?```$/g, "")}</code>
          </pre>
        ) : (
          <p key={i}>{b}</p>
        ),
      )}
    </div>
  );
}
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
function ChartTable({ data }) {
  return (
    <details className="lib-chart-table">
      <summary>View data table</summary>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
export function ColumnChart({ data = chartData }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="lib-chart">
      <div
        className="lib-columns"
        role="img"
        aria-label={data.map((d) => `${d.label}: ${d.value}`).join(", ")}
      >
        {data.map((d, i) => (
          <div key={d.label}>
            <strong>{d.value}</strong>
            <span
              style={{
                height: `${(d.value / max) * 125}px`,
                background: `var(--chart-${(i % 6) + 1})`,
              }}
            />
            <small>{d.label}</small>
          </div>
        ))}
      </div>
      <ChartTable data={data} />
    </div>
  );
}
export function Sparkline({ data = chartData }) {
  const max = Math.max(...data.map((x) => x.value), 1),
    points = data
      .map(
        (d, i) =>
          `${20 + (i * 260) / Math.max(1, data.length - 1)},${90 - (d.value / max) * 70}`,
      )
      .join(" ");
  return (
    <div className="lib-chart">
      <svg
        className="lib-sparkline"
        role="img"
        aria-label={data.map((d) => `${d.label}: ${d.value}`).join(", ")}
        viewBox="0 0 300 110"
      >
        <path d="M20 90h260" stroke="var(--line)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--chart-trend)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => (
          <circle
            key={d.label}
            cx={20 + (i * 260) / Math.max(1, data.length - 1)}
            cy={90 - (d.value / max) * 70}
            r="1.75"
            fill="var(--raise)"
            stroke="var(--chart-trend)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <ChartTable data={data} />
    </div>
  );
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
export function DayTimeline({ onSelect }) {
  return (
    <div className="lib-day-timeline">
      <header>
        <CalendarDays size={17} />
        <strong>Friday, 16 October</strong>
        <span>Beirut time</span>
      </header>
      {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((time, i) => (
        <div key={time}>
          <time>{time}</time>
          <div>
            {[1, 2, 5].includes(i) && (
              <button
                onClick={() =>
                  onSelect?.(
                    [
                      "",
                      "Project planning",
                      "Creative review",
                      "",
                      "",
                      "Team sync",
                    ][i],
                  )
                }
                style={{ borderLeftColor: `var(--chart-${(i % 3) + 1})` }}
              >
                <strong>
                  {
                    [
                      "",
                      "Project planning",
                      "Creative review",
                      "",
                      "",
                      "Team sync",
                    ][i]
                  }
                </strong>
                <small>{time} / 30 minutes</small>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export { KanbanBoard } from './KanbanBoard.js';
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
