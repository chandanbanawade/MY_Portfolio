/**
 * MEETING OPTIONS the visitor can choose during booking.
 *
 * Adding a provider here plus a handler in src/lib/meeting.ts is all that's
 * needed — the booking wizard, confirmation page and admin read this list.
 * No API keys live in this file; they stay server-side in environment vars.
 */

import type { MeetingProvider } from "./sessions";

export type MeetingOption = {
  value: MeetingProvider;
  label: string;
  description: string;
  icon: string;
  /** Shown as a small note under the option. */
  note?: string;
};

export const meetingOptions: MeetingOption[] = [
  {
    value: "google_meet",
    label: "Google Meet",
    description: "Video call in the browser. Nothing to install.",
    icon: "Video",
    note: "Recommended — best for screen sharing",
  },
  {
    value: "zoom",
    label: "Zoom",
    description: "Video call via the Zoom app or browser.",
    icon: "Monitor",
  },
  {
    value: "voice_call",
    label: "Voice Call",
    description: "Audio only, over the meeting link. Camera off.",
    icon: "Mic",
    note: "Good on a weak connection",
  },
  {
    value: "whatsapp",
    label: "Phone / WhatsApp Call",
    description: "A direct call to your number at the scheduled time.",
    icon: "Phone",
    note: "Best for short sessions",
  },
];

export function meetingOption(value: string): MeetingOption | undefined {
  return meetingOptions.find((o) => o.value === value);
}

export const meetingLabels: Record<MeetingProvider, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  voice_call: "Voice Call",
  whatsapp: "Phone / WhatsApp Call",
};
