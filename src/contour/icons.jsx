import { Input } from "./BaseFields.js";
import React, { useState } from "react";
import {
  Search,
  X,
  Plus,
  Minus,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
  ExternalLink,
  Menu,
  MoreHorizontal,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
  Grid2X2,
  List,
  Columns3,
  Rows3,
  Maximize2,
  Minimize2,
  Home,
  Folder,
  FolderOpen,
  FolderPlus,
  File,
  FileText,
  FilePlus,
  Files,
  Copy,
  Clipboard,
  Download,
  Upload,
  Link,
  Unlink,
  Bookmark,
  BookOpen,
  Library,
  Archive,
  Trash2,
  Save,
  Pencil,
  PenLine,
  Undo2,
  Redo2,
  RotateCcw,
  RefreshCw,
  Settings2,
  SlidersHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  LockKeyhole,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  LogIn,
  LogOut,
  User,
  Users,
  UserPlus,
  Contact,
  Mail,
  MessageSquare,
  MessagesSquare,
  Send,
  Bell,
  BellOff,
  CalendarDays,
  CalendarCheck,
  Clock3,
  Timer,
  History,
  Activity,
  ChartColumn,
  ChartLine,
  ChartPie,
  TrendingUp,
  TrendingDown,
  Target,
  Flag,
  CheckSquare,
  Square,
  Circle,
  Info,
  AlertTriangle,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Lightbulb,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  Laptop,
  Workflow,
  Cpu,
  Code2,
  Terminal,
  Braces,
  Database,
  Globe,
  Camera,
  Image,
  Video,
  Mic,
  Play,
  Pause,
  CircleStop,
  Volume2,
  VolumeX,
  GripVertical,
  GripHorizontal,
  Move,
  MapPin,
  Heart,
  Star,
  Tag,
  Tags,
  Paperclip,
  Command,
  Keyboard,
  Zap,
  Package,
  Layers,
  Component,
  Palette,
  Type,
  Ruler,
  MousePointer2,
  Accessibility,
  Sparkles,
  Presentation,
  ShoppingCart,
  Megaphone,
  Building2,
  Handshake,
  Github, Gitlab, Instagram, Linkedin, Youtube, Facebook, Twitter, Slack, Figma, Dribbble, Twitch, Chrome,
} from "lucide-react";
import { Button, Dropdown, Status } from "./ui.js";

const groups = {
  "Social & platforms": {Github, Gitlab, Instagram, Linkedin, Youtube, Facebook, Twitter, Slack, Figma, Dribbble, Twitch, Chrome},
  Navigation: {
    Home,
    LayoutDashboard,
    Menu,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    ArrowUpRight,
    ArrowDownLeft,
    ExternalLink,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    Maximize2,
    Minimize2,
  },
  Actions: {
    Search,
    X,
    Plus,
    Minus,
    Check,
    CheckCheck,
    MoreHorizontal,
    MoreVertical,
    Copy,
    Clipboard,
    Save,
    Pencil,
    PenLine,
    Undo2,
    Redo2,
    RotateCcw,
    RefreshCw,
    Settings2,
    SlidersHorizontal,
    Filter,
    SortAsc,
    SortDesc,
    ArrowUpDown,
    Download,
    Upload,
    Trash2,
    Archive,
    Link,
    Unlink,
  },
  Workspace: {
    Grid2X2,
    List,
    Columns3,
    Rows3,
    Folder,
    FolderOpen,
    FolderPlus,
    File,
    FileText,
    FilePlus,
    Files,
    Bookmark,
    BookOpen,
    Library,
    Tag,
    Tags,
    Paperclip,
    Package,
    Layers,
    Component,
    Palette,
    Type,
    Ruler,
    Presentation,
    ShoppingCart,
    Building2,
  },
  "People & communication": {
    User,
    Users,
    UserPlus,
    Contact,
    Mail,
    MessageSquare,
    MessagesSquare,
    Send,
    Bell,
    BellOff,
    Heart,
    Star,
    MapPin,
    Megaphone,
    Handshake,
  },
  "Time & data": {
    CalendarDays,
    CalendarCheck,
    Clock3,
    Timer,
    History,
    Activity,
    ChartColumn,
    ChartLine,
    ChartPie,
    TrendingUp,
    TrendingDown,
    Target,
    Flag,
  },
  "States & access": {
    CheckSquare,
    Square,
    Circle,
    Info,
    AlertTriangle,
    CircleAlert,
    CircleCheck,
    CircleHelp,
    Eye,
    EyeOff,
    LockKeyhole,
    Unlock,
    ShieldCheck,
    ShieldAlert,
    KeyRound,
    LogIn,
    LogOut,
    Accessibility,
  },
  "Studio & media": {
    Workflow,
    Cpu,
    Code2,
    Terminal,
    Braces,
    Database,
    Globe,
    Camera,
    Image,
    Video,
    Mic,
    Play,
    Pause,
    CircleStop,
    Volume2,
    VolumeX,
    Lightbulb,
    Zap,
    Sparkles,
  },
  Interface: {
    Sun,
    Moon,
    Monitor,
    Tablet,
  Smartphone,
    Laptop,
    GripVertical,
    GripHorizontal,
    Move,
    Command,
    Keyboard,
    MousePointer2,
  },
};
export const iconRegistry = Object.entries(groups).flatMap(
  ([category, icons]) =>
    Object.entries(icons).map(([name, icon]) => ({ name, icon, category })),
);
/** @param {{ name: string; size?: number; label?: string } & Omit<React.SVGProps<SVGSVGElement>, 'name' | 'size'>} props */
export function Icon({ name, size = 20, label = undefined, ...props }) {
  const Glyph = iconRegistry.find((x) => x.name === name)?.icon || CircleHelp;
  return (
    <Glyph
      size={size}
      strokeWidth="var(--icon-stroke, 1.65)"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      {...props}
    />
  );
}
export function IconsPage({ notify }) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All icons"),
    [selected, setSelected] = useState("Layers"),
    [size, setSize] = useState("20");
  const matches = iconRegistry.filter(
    (x) =>
      (category === "All icons" || x.category === category) &&
      x.name.toLowerCase().includes(query.toLowerCase().replaceAll(" ", "")),
  );
  const current = iconRegistry.find((x) => x.name === selected),
    Glyph = current.icon;
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Icon code copied");
    } catch {
      notify("Clipboard unavailable. Select the code below to copy it.");
    }
  };
  return (
    <div className="system-page icons-page">
      <div className="system-page-heading">
        <div>
          <span className="page-context">The Contour icon library</span>
          <h2>Small details. A shared language.</h2>
          <p>
            {iconRegistry.length} carefully selected Lucide icons across{" "}
            {Object.keys(groups).length} categories. One consistent 1.65px
            stroke, a 24px drawing grid, and clear optical alignment.
          </p>
        </div>
        <a className="btn" href="/contour-icons.zip" download><Download size={14} />Download {iconRegistry.length} icons</a>
      </div>
      <div className="icon-tools">
        <label className="search-field">
          <Search size={16} />
          <Input
            variant="embedded"
            value={query}
            aria-label="Search icons"
            placeholder="Search icons by name"
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear icon search" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </label>
        <Dropdown
          aria-label="Icon category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={["All icons", ...Object.keys(groups)].map((label) => ({
            label,
            value: label,
          }))}
        />
        <div
          className="icon-size-picker"
          role="group"
          aria-label="Preview icon size"
        >
          {["16", "20", "24"].map((s) => (
            <button
              key={s}
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>
      <div className="icon-library-layout">
        <div>
          <p className="icon-result-count" role="status">
            {matches.length} icons{query && ` matching “${query}”`}
          </p>
          <div className="icon-grid">
            {matches.map(({ name, icon: Item }) => (
              <button
                key={name}
                className={selected === name ? "selected" : ""}
                aria-pressed={selected === name}
                onClick={() => setSelected(name)}
                title={name}
              >
                <Item
                  size={Number(size)}
                  strokeWidth="var(--icon-stroke, 1.65)"
                  aria-hidden="true"
                />
                <span>{name}</span>
              </button>
            ))}
          </div>
          {!matches.length && (
            <div className="empty-state">
              <h3>No matching icons</h3>
              <p>Try a simpler name, or choose All icons.</p>
              <Button
                onClick={() => {
                  setQuery("");
                  setCategory("All icons");
                }}
              >
                Reset search
              </Button>
            </div>
          )}
        </div>
        <aside className="icon-inspector">
          <div className="icon-large-preview">
            <Glyph size={48} strokeWidth="var(--icon-stroke, 1.65)" />
          </div>
          <h3>{selected}</h3>
          <p>{current.category}</p>
          <div className="icon-optical-sizes">
            {[16, 20, 24, 32].map((s) => (
              <div key={s}>
                <Glyph size={s} strokeWidth="var(--icon-stroke, 1.65)" />
                <span>{s}px</span>
              </div>
            ))}
          </div>
          <Button onClick={() => copy(`<Icon name="${selected}" size={20} />`)}>
            <Copy size={14} />
            Copy component
          </Button>
          <pre>
            <code>{`<Icon\n  name="${selected}"\n  size={20}\n/>`}</code>
          </pre>
          <details className="icon-import">
            <summary>Lucide import</summary>
            <code>{`import { ${selected} } from 'lucide-react';`}</code>
          </details>
          <div className="icon-guidance">
            <strong>Use with intention</strong>
            <p>
              14px inside buttons. 16px for navigation. 24px for section
              markers. Use 32px only for a meaningful illustration.
            </p>
            <p>
              Pair ambiguous icons with text. Give icon-only buttons an
              accessible name and a 44px touch target.
            </p>
            <p>
              Keep icons neutral. Use pink for active states, and semantic
              colors only when communicating a status.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
