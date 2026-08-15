/**
 * Icon registry — maps the string names used in config files to lucide icons.
 * Importing by name keeps config files free of React imports and lets the admin
 * dashboard offer a plain text field for icons.
 *
 * Add an icon here before referencing it from a config file; unknown names fall
 * back to Sparkles rather than crashing.
 */

import {
  Award,
  Boxes,
  BrainCircuit,
  Bug,
  ChartLine,
  CircleDollarSign,
  Code2,
  Cpu,
  Crosshair,
  FileText,
  Gift,
  Globe,
  Lightbulb,
  Lock,
  Map,
  MessagesSquare,
  Mic,
  Monitor,
  Phone,
  Presentation,
  Rocket,
  Route,
  ScrollText,
  Server,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Award,
  Boxes,
  BrainCircuit,
  Bug,
  ChartLine,
  CircleDollarSign,
  Code2,
  Cpu,
  Crosshair,
  FileText,
  Gift,
  Globe,
  Lightbulb,
  Lock,
  Map,
  MessagesSquare,
  Mic,
  Monitor,
  Phone,
  Presentation,
  Rocket,
  Route,
  ScrollText,
  Server,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  Users,
  Video,
  Wrench,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = registry[name] ?? Sparkles;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export const iconNames = Object.keys(registry);
