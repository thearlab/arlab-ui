'use client';

import type { SVGProps } from 'react';
import {
  Search, X, Plus, Minus, Check, CheckCheck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  ArrowUpRight, ArrowDownLeft, ArrowUpDown, ExternalLink, Menu, MoreHorizontal, MoreVertical, PanelLeftClose, PanelLeftOpen, PanelRightClose,
  PanelRightOpen, LayoutDashboard, Grid2X2, List, Columns3, Rows3, Maximize2, Minimize2, Home, Folder, FolderOpen, FolderPlus, File, FileText,
  FilePlus, Files, Copy, Clipboard, Download, Upload, Link, Unlink, Bookmark, BookOpen, Library, Archive, Trash2, Save, Pencil, PenLine, Undo2,
  Redo2, RotateCcw, RefreshCw, Settings2, SlidersHorizontal, Filter, SortAsc, SortDesc, Eye, EyeOff, LockKeyhole, Unlock, ShieldCheck,
  ShieldAlert, KeyRound, LogIn, LogOut, User, Users, UserPlus, Contact, Mail, MessageSquare, MessagesSquare, Send, Bell, BellOff, CalendarDays,
  CalendarCheck, Clock3, Timer, History, Activity, ChartColumn, ChartLine, ChartPie, TrendingUp, TrendingDown, Target, Flag, CheckSquare, Square,
  Circle, Info, AlertTriangle, CircleAlert, CircleCheck, CircleHelp, Lightbulb, Sun, Moon, Monitor, Smartphone, Laptop, Workflow, Cpu, Code2,
  Terminal, Braces, Database, Globe, Camera, Image, Video, Mic, Play, Pause, CircleStop, Volume2, VolumeX, GripVertical, GripHorizontal, Move,
  MapPin, Heart, Star, Tag, Tags, Paperclip, Command, Keyboard, Zap, Package, Layers, Component, Palette, Type, Ruler, MousePointer2, Accessibility,
  Building2, Presentation, Briefcase, ShoppingCart, Megaphone, Sparkles, Github,
  type LucideIcon,
} from 'lucide-react';

/* The Contour icon library: Lucide on a 24px grid, one 1.65px stroke, sizes 14 / 16 / 20 (48 only for empty
   states). Names and groups match the ARLAB Internal Design System registry; the last group lists icons the
   apps needed that the registry did not have yet (logged in CONTOUR-MIGRATION.md). */
const groups: Record<string, Record<string, LucideIcon>> = {
  Navigation: { Home, LayoutDashboard, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ArrowUpRight, ArrowDownLeft, ExternalLink, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Maximize2, Minimize2 },
  Actions: { Search, X, Plus, Minus, Check, CheckCheck, MoreHorizontal, MoreVertical, Copy, Clipboard, Save, Pencil, PenLine, Undo2, Redo2, RotateCcw, RefreshCw, Settings2, SlidersHorizontal, Filter, SortAsc, SortDesc, ArrowUpDown, Download, Upload, Trash2, Archive, Link, Unlink },
  Workspace: { Grid2X2, List, Columns3, Rows3, Folder, FolderOpen, FolderPlus, File, FileText, FilePlus, Files, Bookmark, BookOpen, Library, Tag, Tags, Paperclip, Package, Layers, Component, Palette, Type, Ruler },
  'People & communication': { User, Users, UserPlus, Contact, Mail, MessageSquare, MessagesSquare, Send, Bell, BellOff, Heart, Star, MapPin },
  'Time & data': { CalendarDays, CalendarCheck, Clock3, Timer, History, Activity, ChartColumn, ChartLine, ChartPie, TrendingUp, TrendingDown, Target, Flag },
  'States & access': { CheckSquare, Square, Circle, Info, AlertTriangle, CircleAlert, CircleCheck, CircleHelp, Eye, EyeOff, LockKeyhole, Unlock, ShieldCheck, ShieldAlert, KeyRound, LogIn, LogOut, Accessibility },
  'Studio & media': { Workflow, Cpu, Code2, Terminal, Braces, Database, Globe, Camera, Image, Video, Mic, Play, Pause, CircleStop, Volume2, VolumeX, Lightbulb, Zap },
  Interface: { Sun, Moon, Monitor, Smartphone, Laptop, GripVertical, GripHorizontal, Move, Command, Keyboard, MousePointer2 },
  'Added for the apps': { Building2, Presentation, Briefcase, ShoppingCart, Megaphone, Sparkles, Github },
};
export type IconName = keyof typeof groups[string] & string;
export const iconRegistry = Object.entries(groups).flatMap(([category, icons]) => Object.entries(icons).map(([name, icon]) => ({ name, icon, category })));
const byName = new Map(iconRegistry.map((x) => [x.name, x.icon]));

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** 14, 16 or 20 (default 20); 48 only for empty states. */
  size?: number;
  /** Given, the icon is announced (role img); left out, it is decoration and hidden from screen readers. */
  label?: string;
}

/** One icon from the registry by name. An unknown name draws CircleHelp, so a typo shows instead of vanishing. */
export function Icon({ name, size = 20, label, className = '', ...props }: IconProps & { name: string }) {
  const Glyph = byName.get(name) || CircleHelp;
  return <Glyph size={size} strokeWidth={1.65} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} className={['arlab-icon', className].filter(Boolean).join(' ')} {...(props as object)} />;
}

/* The 1.x named icons, kept so existing imports work. Each is the registry icon of the same meaning
   (default 18px as before). */
function named(displayName: string, name: string) {
  function Cmp({ size = 18, ...props }: IconProps) { return <Icon name={name} size={size} {...props} />; }
  Cmp.displayName = displayName;
  return Cmp;
}
export const MenuIcon = named('MenuIcon', 'Menu');
export const ChevronDownIcon = named('ChevronDownIcon', 'ChevronDown');
export const ChevronRightIcon = named('ChevronRightIcon', 'ChevronRight');
export const ChevronLeftIcon = named('ChevronLeftIcon', 'ChevronLeft');
export const CloseIcon = named('CloseIcon', 'X');
export const SearchIcon = named('SearchIcon', 'Search');
export const CheckIcon = named('CheckIcon', 'Check');
export const PlusIcon = named('PlusIcon', 'Plus');
export const TrashIcon = named('TrashIcon', 'Trash2');
export const ExternalLinkIcon = named('ExternalLinkIcon', 'ExternalLink');
export const CopyIcon = named('CopyIcon', 'Copy');
export const KeyIcon = named('KeyIcon', 'KeyRound');
export const UserIcon = named('UserIcon', 'User');
export const UsersIcon = named('UsersIcon', 'Users');
export const SettingsIcon = named('SettingsIcon', 'Settings2');
export const MoreHorizontalIcon = named('MoreHorizontalIcon', 'MoreHorizontal');
export const RefreshIcon = named('RefreshIcon', 'RefreshCw');
export const ArrowRightIcon = named('ArrowRightIcon', 'ArrowRight');
export const AlertTriangleIcon = named('AlertTriangleIcon', 'AlertTriangle');
export const InfoCircleIcon = named('InfoCircleIcon', 'Info');
export const SunIcon = named('SunIcon', 'Sun');
export const MoonIcon = named('MoonIcon', 'Moon');
export const UploadIcon = named('UploadIcon', 'Upload');
