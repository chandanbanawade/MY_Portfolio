/**
 * MEETING PROVIDER ABSTRACTION
 * =============================================================================
 * Nothing in the app talks to Google Meet or Zoom directly — everything goes
 * through `createMeeting()`. Adding a real provider later means implementing
 * one function below; no route, component or database change is required.
 *
 * NO API KEY IS READ IN CLIENT CODE. Provider credentials stay in environment
 * variables and are only ever touched inside these server-side functions.
 *
 * Current behaviour without credentials configured:
 *   google_meet / zoom → uses a static room link if one is set, otherwise
 *                        records that the link will be emailed. Never fabricates
 *                        a meeting URL.
 *   voice_call         → meeting link with camera-off instructions.
 *   whatsapp           → wa.me / tel: link built from the mentor's own number.
 */

import { site } from "@/config/site";
import type { MeetingProvider } from "./types";

export type MeetingRequest = {
  provider: MeetingProvider;
  reference: string;
  dateKey: string;
  startMinutes: number;
  durationMin: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  sessionTitle: string;
};

export type MeetingResult = {
  provider: MeetingProvider;
  joinUrl: string | null;
  /** Shown to the customer when there is no clickable link yet. */
  instructions: string;
};

async function createGoogleMeet(req: MeetingRequest): Promise<MeetingResult> {
  // PRODUCTION PATH — set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
  // GOOGLE_REFRESH_TOKEN, then call the Calendar API with
  // conferenceDataVersion=1 and return `data.hangoutLink`.
  // Deliberately left unimplemented rather than returning a fake URL.
  const staticLink = process.env.MEETING_STATIC_LINK;

  if (staticLink) {
    return {
      provider: "google_meet",
      joinUrl: staticLink,
      instructions:
        "Join using the Google Meet link below at your scheduled time.",
    };
  }

  return {
    provider: "google_meet",
    joinUrl: null,
    instructions: `Your Google Meet link will be emailed to you before the session. Quote booking ID ${req.reference} if you need to get in touch.`,
  };
}

async function createZoomMeeting(req: MeetingRequest): Promise<MeetingResult> {
  // PRODUCTION PATH — Zoom Server-to-Server OAuth app:
  //   POST https://api.zoom.us/v2/users/me/meetings → return `join_url`
  const staticLink = process.env.ZOOM_STATIC_LINK;

  if (staticLink) {
    return {
      provider: "zoom",
      joinUrl: staticLink,
      instructions: "Join using the Zoom link below at your scheduled time.",
    };
  }

  return {
    provider: "zoom",
    joinUrl: null,
    instructions: `Your Zoom link will be emailed to you before the session (booking ID ${req.reference}).`,
  };
}

function createVoiceCall(req: MeetingRequest): MeetingResult {
  const staticLink = process.env.MEETING_STATIC_LINK;

  return {
    provider: "voice_call",
    joinUrl: staticLink ?? null,
    instructions: staticLink
      ? "Audio-only session — join the link below and keep your camera off."
      : `Audio-only session. The joining link will be emailed to you before the session (booking ID ${req.reference}).`,
  };
}

function createWhatsAppCall(req: MeetingRequest): MeetingResult {
  const text = encodeURIComponent(
    `Hi Chandan, I have a mentorship session booked (ID ${req.reference}).`,
  );

  return {
    provider: "whatsapp",
    joinUrl: `https://wa.me/${site.contact.whatsapp}?text=${text}`,
    instructions: req.customerPhone
      ? `You'll receive a call on ${req.customerPhone} at the scheduled time. You can also message on the link below.`
      : "You'll receive a call at the scheduled time. You can also message on the link below.",
  };
}

export async function createMeeting(
  req: MeetingRequest,
): Promise<MeetingResult> {
  switch (req.provider) {
    case "google_meet":
      return createGoogleMeet(req);
    case "zoom":
      return createZoomMeeting(req);
    case "voice_call":
      return createVoiceCall(req);
    case "whatsapp":
      return createWhatsAppCall(req);
    default:
      return createGoogleMeet(req);
  }
}
