"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Gift,
  Info,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Calendar } from "./calendar";
import { TimePicker } from "./time-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  Badge,
  Field,
  Input,
  Textarea,
  Alert,
  Spinner,
} from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { categoryGroups, groupOrder } from "@/config/categories";
import { meetingOptions } from "@/config/meetings";
import type { SessionTypeView, CategoryView } from "@/lib/data";
import { formatInr, cn } from "@/lib/format";
import { formatDuration, formatDateLong, formatRange } from "@/lib/time";
import { site } from "@/config/site";
import type { MeetingProvider } from "@/lib/types";

/* -------------------------------------------------------------------------- */

const STEPS = [
  { key: "category", label: "Area" },
  { key: "session", label: "Session" },
  { key: "meeting", label: "Meeting" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
] as const;

const STEP = {
  CATEGORY: 0,
  SESSION: 1,
  MEETING: 2,
  DATE: 3,
  TIME: 4,
  DETAILS: 5,
  REVIEW: 6,
  PAYMENT: 7,
} as const;

type Details = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  topic: string;
  helpWith: string;
  notes: string;
};

const EMPTY_DETAILS: Details = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  topic: "",
  helpWith: "",
  notes: "",
};

type CreatedBooking = {
  reference: string;
  bookingId: string;
  amountInr: number;
  isFree: boolean;
  provider: "mock" | "razorpay" | "free";
  orderId: string | null;
  publicKey: string | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

/* -------------------------------------------------------------------------- */

export function BookingWizard({
  sessions,
  categories,
  packageNote,
}: {
  sessions: SessionTypeView[];
  categories: CategoryView[];
  packageNote?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(STEP.CATEGORY);
  const [categorySlug, setCategorySlug] = useState<string>();
  const [sessionSlug, setSessionSlug] = useState<string>();
  const [meetingProvider, setMeetingProvider] = useState<MeetingProvider>();
  const [date, setDate] = useState<string>();
  const [startMinutes, setStartMinutes] = useState<number>();
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<CreatedBooking | null>(null);
  const [slotRefresh, setSlotRefresh] = useState(0);

  /** Free-consultation eligibility for the email currently entered. */
  const [freeBlocked, setFreeBlocked] = useState<string | null>(null);
  const [checkingFree, setCheckingFree] = useState(false);

  const session = useMemo(
    () => sessions.find((s) => s.slug === sessionSlug),
    [sessions, sessionSlug],
  );
  const category = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  const isFreeSession = Boolean(session?.isFree);

  /** Meeting options this session actually allows. */
  const availableMeetings = useMemo(() => {
    if (!session) return meetingOptions;
    return meetingOptions.filter((o) =>
      session.allowedProviders.includes(o.value),
    );
  }, [session]);

  /* --- Preselection from ?session= / ?category= ---------------------------- */
  useEffect(() => {
    const qSession = searchParams.get("session");
    const qCategory = searchParams.get("category");

    if (qCategory && categories.some((c) => c.slug === qCategory)) {
      setCategorySlug(qCategory);
    }
    if (qSession && sessions.some((s) => s.slug === qSession)) {
      setSessionSlug(qSession);
    }

    if (qSession && qCategory) setStep(STEP.MEETING);
    else if (qSession) setStep(STEP.CATEGORY);
    else if (qCategory) setStep(STEP.SESSION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- Reset downstream choices when the session changes ------------------- */
  useEffect(() => {
    setStartMinutes(undefined);
    setMeetingProvider((current) =>
      current && session?.allowedProviders.includes(current) ? current : undefined,
    );
    if (!session?.isFree) setFreeBlocked(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSlug]);

  function goTo(next: number) {
    setFormError(null);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canAdvance = (() => {
    switch (step) {
      case STEP.CATEGORY:
        return Boolean(categorySlug);
      case STEP.SESSION:
        return Boolean(sessionSlug);
      case STEP.MEETING:
        return Boolean(meetingProvider);
      case STEP.DATE:
        return Boolean(date);
      case STEP.TIME:
        return startMinutes !== undefined;
      case STEP.DETAILS:
        return (
          details.fullName.trim().length >= 2 &&
          /\S+@\S+\.\S+/.test(details.email) &&
          details.helpWith.trim().length >= 10 &&
          !freeBlocked
        );
      default:
        return true;
    }
  })();

  function updateDetail(key: keyof Details, value: string) {
    setDetails((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[`details.${key}`]) return prev;
      const next = { ...prev };
      delete next[`details.${key}`];
      return next;
    });
    if (key === "email") setFreeBlocked(null);
  }

  /**
   * Courtesy check so someone isn't told their free consultation is unavailable
   * only after filling in the entire form. The authoritative check is atomic and
   * happens server-side at booking time.
   */
  async function checkFreeEligibility() {
    if (!isFreeSession || !/\S+@\S+\.\S+/.test(details.email)) return;

    setCheckingFree(true);
    try {
      const response = await fetch("/api/free-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: details.email }),
      });
      const data = await response.json();
      setFreeBlocked(data.eligible ? null : (data.message ?? null));
    } catch {
      // Network hiccup — let them proceed; the server check still applies.
      setFreeBlocked(null);
    } finally {
      setCheckingFree(false);
    }
  }

  /* --- Create the booking -------------------------------------------------- */
  async function handleCreateBooking() {
    if (!session || !date || startMinutes === undefined || !meetingProvider) return;

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionSlug: session.slug,
          categorySlug,
          meetingProvider,
          date,
          startMinutes,
          details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setStartMinutes(undefined);
          setSlotRefresh((n) => n + 1);
          setFormError(data.error ?? "That time was just booked.");
          goTo(STEP.TIME);
          return;
        }
        if (data.code === "FREE_ALREADY_USED" || data.code === "FREE_DISABLED") {
          setFreeBlocked(data.error);
          setFormError(data.error);
          goTo(STEP.DETAILS);
          return;
        }
        if (data.fields) {
          setErrors(data.fields);
          setFormError(data.error ?? "Please check your details.");
          goTo(STEP.DETAILS);
          return;
        }
        setFormError(data.error ?? "Something went wrong.");
        return;
      }

      const created = data as CreatedBooking;
      setBooking(created);

      // Free sessions are confirmed server-side — no payment step at all.
      if (created.isFree) {
        router.push(`/booking/${created.reference}`);
        return;
      }

      goTo(STEP.PAYMENT);
    } catch {
      setFormError("Network problem — please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  /* --- Payment ------------------------------------------------------------- */
  async function confirmPayment(payload?: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    if (!booking) return;
    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: booking.reference, ...payload }),
      });
      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error ?? "Payment could not be confirmed.");
        return;
      }
      router.push(`/booking/${booking.reference}`);
    } catch {
      setFormError("Network problem confirming payment. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }

  async function openRazorpay() {
    if (!booking?.publicKey || !booking.orderId) return;
    setSubmitting(true);
    setFormError(null);

    try {
      await loadRazorpayScript();
      if (!window.Razorpay) {
        setFormError("Could not load the payment window. Please retry.");
        return;
      }

      const checkout = new window.Razorpay({
        key: booking.publicKey,
        amount: booking.amountInr * 100,
        currency: "INR",
        name: site.name,
        description: session?.title ?? "Mentorship session",
        order_id: booking.orderId,
        prefill: {
          name: details.fullName,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#2563eb" },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          void confirmPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: { ondismiss: () => setSubmitting(false) },
      } as Record<string, unknown>);

      checkout.open();
    } catch {
      setFormError("Could not open the payment window. Please retry.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------------------------------------------------ */

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-10">
      <div className="min-w-0">
        <Stepper current={step} />

        {packageNote && step === STEP.CATEGORY && (
          <Alert tone="accent" className="mb-6">
            <span className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{packageNote}</span>
            </span>
          </Alert>
        )}

        {formError && (
          <Alert tone="danger" className="mb-6">
            {formError}
          </Alert>
        )}

        {/* --- 1. Mentorship area --- */}
        {step === STEP.CATEGORY && (
          <StepShell
            title="What do you need help with?"
            description="Pick the closest match — I'll prepare around it before we meet."
          >
            <div className="space-y-7">
              {groupOrder.map((groupKey) => {
                const items = categories.filter((c) => c.group === groupKey);
                if (items.length === 0) return null;

                return (
                  <div key={groupKey}>
                    <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">
                      <Icon
                        name={categoryGroups[groupKey].icon}
                        className="h-3.5 w-3.5"
                      />
                      {categoryGroups[groupKey].label}
                    </h3>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {items.map((item) => (
                        <SelectableCard
                          key={item.slug}
                          selected={categorySlug === item.slug}
                          onClick={() => setCategorySlug(item.slug)}
                        >
                          <div className="flex gap-3">
                            <Icon
                              name={item.icon}
                              className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium leading-snug text-fg">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </SelectableCard>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepShell>
        )}

        {/* --- 2. Session --- */}
        {step === STEP.SESSION && (
          <StepShell
            title="Choose your session"
            description="New here? The free consultation is the best place to start."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {sessions.map((item) => (
                <SelectableCard
                  key={item.slug}
                  selected={sessionSlug === item.slug}
                  onClick={() => setSessionSlug(item.slug)}
                  highlight={item.isFree}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Clock
                          className="h-3.5 w-3.5 text-fg-subtle"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs font-medium text-fg-muted">
                          {formatDuration(item.durationMin)}
                        </span>
                        {item.isFree && (
                          <Badge tone="success">
                            <Gift className="h-3 w-3" strokeWidth={2} />
                            Free
                          </Badge>
                        )}
                        {item.popular && <Badge tone="accent">Popular</Badge>}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-fg">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                        {item.tagline}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-lg font-semibold tracking-tight",
                        item.isFree ? "text-success" : "text-fg",
                      )}
                    >
                      {item.priceInr === 0 ? "₹0" : formatInr(item.priceInr)}
                    </span>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </StepShell>
        )}

        {/* --- 3. Meeting method --- */}
        {step === STEP.MEETING && (
          <StepShell
            title="How would you like to meet?"
            description="Pick whichever is easiest for you. Details arrive with your confirmation."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {availableMeetings.map((option) => (
                <SelectableCard
                  key={option.value}
                  selected={meetingProvider === option.value}
                  onClick={() => setMeetingProvider(option.value)}
                >
                  <div className="flex gap-3">
                    <Icon
                      name={option.icon}
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">
                        {option.label}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                        {option.description}
                      </p>
                      {option.note && (
                        <p className="mt-1.5 text-[0.6875rem] font-medium text-accent">
                          {option.note}
                        </p>
                      )}
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </StepShell>
        )}

        {/* --- 4. Date --- */}
        {step === STEP.DATE && session && (
          <StepShell
            title="Choose a date"
            description={`Days with availability for a ${formatDuration(session.durationMin)} session. All times ${site.timezoneLabel}.`}
          >
            <div className="max-w-md">
              <Calendar
                durationMin={session.durationMin}
                selected={date}
                onSelect={(next) => {
                  setDate(next);
                  setStartMinutes(undefined);
                }}
              />
            </div>
          </StepShell>
        )}

        {/* --- 5. Time --- */}
        {step === STEP.TIME && session && (
          <StepShell
            title="Choose a time"
            description={`Available start times on your selected date, ${site.timezoneLabel}.`}
          >
            <TimePicker
              date={date}
              durationMin={session.durationMin}
              selected={startMinutes}
              onSelect={setStartMinutes}
              refreshToken={slotRefresh}
            />
            <button
              type="button"
              onClick={() => goTo(STEP.DATE)}
              className="mt-5 text-sm font-medium text-accent hover:underline"
            >
              ← Pick a different date
            </button>
          </StepShell>
        )}

        {/* --- 6. Details --- */}
        {step === STEP.DETAILS && (
          <StepShell
            title="Your details"
            description="The more context you give me, the more useful the session will be."
          >
            {isFreeSession && (
              <Alert tone="accent" className="mb-5">
                <span className="flex items-start gap-2">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                  <span>
                    This is your <strong>free one-time consultation</strong>.
                    There&apos;s nothing to pay and no card details are needed.
                  </span>
                </span>
              </Alert>
            )}

            {freeBlocked && (
              <Alert tone="warning" title="Free consultation already used" className="mb-5">
                {freeBlocked}
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required htmlFor="fullName" error={errors["details.fullName"]}>
                <Input
                  id="fullName"
                  value={details.fullName}
                  onChange={(e) => updateDetail("fullName", e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  invalid={Boolean(errors["details.fullName"])}
                />
              </Field>

              <Field
                label="Email"
                required
                htmlFor="email"
                hint={checkingFree ? "Checking…" : "Confirmation goes here"}
                error={errors["details.email"]}
              >
                <Input
                  id="email"
                  type="email"
                  value={details.email}
                  onChange={(e) => updateDetail("email", e.target.value)}
                  onBlur={() => void checkFreeEligibility()}
                  placeholder="you@example.com"
                  autoComplete="email"
                  invalid={Boolean(errors["details.email"]) || Boolean(freeBlocked)}
                />
              </Field>

              <Field label="Phone" hint="Optional" htmlFor="phone" error={errors["details.phone"]}>
                <Input
                  id="phone"
                  type="tel"
                  value={details.phone}
                  onChange={(e) => updateDetail("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                  autoComplete="tel"
                  invalid={Boolean(errors["details.phone"])}
                />
              </Field>

              <Field label="Mentorship topic" hint="Optional" htmlFor="topic" error={errors["details.topic"]}>
                <Input
                  id="topic"
                  value={details.topic}
                  onChange={(e) => updateDetail("topic", e.target.value)}
                  placeholder={category?.title ?? "e.g. Bug bounty roadmap"}
                  invalid={Boolean(errors["details.topic"])}
                />
              </Field>

              <Field label="LinkedIn" hint="Optional" htmlFor="linkedin" error={errors["details.linkedin"]}>
                <Input
                  id="linkedin"
                  value={details.linkedin}
                  onChange={(e) => updateDetail("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/…"
                  invalid={Boolean(errors["details.linkedin"])}
                />
              </Field>

              <Field label="GitHub" hint="Optional" htmlFor="github" error={errors["details.github"]}>
                <Input
                  id="github"
                  value={details.github}
                  onChange={(e) => updateDetail("github", e.target.value)}
                  placeholder="github.com/…"
                  invalid={Boolean(errors["details.github"])}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="What would you like help with?"
                  required
                  htmlFor="helpWith"
                  error={errors["details.helpWith"]}
                >
                  <Textarea
                    id="helpWith"
                    value={details.helpWith}
                    onChange={(e) => updateDetail("helpWith", e.target.value)}
                    placeholder="e.g. I'm a final-year student who wants to move into AI/ML but I don't know which projects are worth building."
                    invalid={Boolean(errors["details.helpWith"])}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Additional notes" hint="Optional" htmlFor="notes" error={errors["details.notes"]}>
                  <Textarea
                    id="notes"
                    value={details.notes}
                    onChange={(e) => updateDetail("notes", e.target.value)}
                    placeholder="Links to your resume, repo or portfolio — anything you'd like me to look at beforehand."
                    className="min-h-[90px]"
                    invalid={Boolean(errors["details.notes"])}
                  />
                </Field>
              </div>
            </div>
          </StepShell>
        )}

        {/* --- 7. Review --- */}
        {step === STEP.REVIEW && session && date && startMinutes !== undefined && (
          <StepShell
            title="Review your booking"
            description={
              isFreeSession
                ? "Check everything is right — confirming books your free consultation immediately."
                : "Check everything is right — you'll pay on the next step."
            }
          >
            <Card className="divide-y divide-[var(--border)]">
              <ReviewRow label="Mentorship area" value={category?.title ?? "General mentorship"} />
              <ReviewRow label="Session" value={session.title} />
              <ReviewRow label="Duration" value={formatDuration(session.durationMin)} />
              <ReviewRow label="Date" value={formatDateLong(date)} />
              <ReviewRow
                label="Time"
                value={`${formatRange(startMinutes, session.durationMin)} ${site.timezoneLabel}`}
              />
              <ReviewRow
                label="Meeting method"
                value={
                  meetingOptions.find((o) => o.value === meetingProvider)?.label ??
                  "—"
                }
              />
              <ReviewRow label="Name" value={details.fullName} />
              <ReviewRow label="Email" value={details.email} />
              {details.phone && <ReviewRow label="Phone" value={details.phone} />}
              {details.topic && <ReviewRow label="Topic" value={details.topic} />}

              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
                  What you need help with
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {details.helpWith}
                </p>
              </div>

              <div className="flex items-center justify-between bg-surface-2 px-5 py-4">
                <span className="text-sm font-medium text-fg">Total</span>
                <span
                  className={cn(
                    "text-xl font-semibold tracking-tight",
                    isFreeSession ? "text-success" : "text-fg",
                  )}
                >
                  {isFreeSession ? "Free" : formatInr(session.priceInr)}
                </span>
              </div>
            </Card>

            <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
              Sessions are mentorship and guidance only. Free reschedule up to 12
              hours before
              {!isFreeSession &&
                "; full refund if you cancel at least 24 hours before"}
              .
            </p>
          </StepShell>
        )}

        {/* --- 8. Payment (paid sessions only) --- */}
        {step === STEP.PAYMENT && booking && session && (
          <StepShell title="Payment" description="Your slot is held while you complete payment.">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-sm font-medium text-fg">{session.title}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">
                    Booking ID {booking.reference}
                  </p>
                </div>
                <span className="text-2xl font-semibold tracking-tight text-fg">
                  {formatInr(booking.amountInr)}
                </span>
              </div>

              {booking.provider === "mock" ? (
                <div className="mt-5">
                  <Alert tone="warning" title="Test mode — no real payment">
                    Razorpay keys aren&apos;t configured, so this checkout is
                    simulated. No money moves and no card details are collected.
                    Add{" "}
                    <code className="font-mono text-[0.6875rem]">RAZORPAY_KEY_ID</code>{" "}
                    and{" "}
                    <code className="font-mono text-[0.6875rem]">RAZORPAY_KEY_SECRET</code>{" "}
                    to <code className="font-mono text-[0.6875rem]">.env</code> for
                    live payments.
                  </Alert>

                  <Button
                    onClick={() => void confirmPayment()}
                    disabled={submitting}
                    size="lg"
                    className="mt-5 w-full"
                  >
                    {submitting ? (
                      <>
                        <Spinner /> Confirming…
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" strokeWidth={2.2} />
                        Simulate successful payment
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="mt-5">
                  <p className="text-sm leading-relaxed text-fg-muted">
                    You&apos;ll be taken to Razorpay&apos;s secure checkout. UPI,
                    cards, net banking and wallets are all supported.
                  </p>
                  <Button
                    onClick={() => void openRazorpay()}
                    disabled={submitting}
                    size="lg"
                    className="mt-5 w-full"
                  >
                    {submitting ? (
                      <>
                        <Spinner /> Opening checkout…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" strokeWidth={2} />
                        Pay {formatInr(booking.amountInr)}
                      </>
                    )}
                  </Button>
                </div>
              )}

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
                <Lock className="h-3 w-3" strokeWidth={2} />
                Your details are used only to run and confirm this session.
              </p>
            </Card>
          </StepShell>
        )}

        {/* --- Navigation --- */}
        {step < STEP.PAYMENT && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => goTo(Math.max(0, step - 1))}
              disabled={step === STEP.CATEGORY || submitting}
              className={step === STEP.CATEGORY ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back
            </Button>

            {step < STEP.REVIEW ? (
              <Button onClick={() => goTo(step + 1)} disabled={!canAdvance} size="lg">
                Continue
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            ) : (
              <Button
                onClick={() => void handleCreateBooking()}
                disabled={submitting}
                size="lg"
              >
                {submitting ? (
                  <>
                    <Spinner /> {isFreeSession ? "Confirming…" : "Holding your slot…"}
                  </>
                ) : (
                  <>
                    {isFreeSession
                      ? "Confirm free consultation"
                      : "Confirm & continue to payment"}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <SummaryRail
        session={session}
        category={category}
        meetingProvider={meetingProvider}
        date={date}
        startMinutes={startMinutes}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-x-1 gap-y-2">
      {STEPS.map((s, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={s.key} className="flex items-center gap-1">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                active && "bg-fg text-fg-inverse",
                done && "text-accent",
                !active && !done && "text-fg-subtle",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[0.5625rem] font-semibold",
                  active && "bg-fg-inverse/20",
                  done && "bg-accent text-white",
                  !active && !done && "bg-surface-3",
                )}
              >
                {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px w-2.5 bg-line-strong sm:w-3" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function SelectableCard({
  selected,
  onClick,
  children,
  highlight,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative rounded-[var(--radius)] border p-4 text-left transition-all",
        selected
          ? "border-accent bg-accent-soft ring-1 ring-accent/25"
          : highlight
            ? "border-[var(--success)]/35 bg-success-soft/40 hover:border-[var(--success)]/60"
            : "border-line bg-surface hover:border-line-strong hover:bg-surface-2",
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-fg-subtle">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-fg">{value}</span>
    </div>
  );
}

function SummaryRail({
  session,
  category,
  meetingProvider,
  date,
  startMinutes,
}: {
  session?: SessionTypeView;
  category?: CategoryView;
  meetingProvider?: MeetingProvider;
  date?: string;
  startMinutes?: number;
}) {
  const isFree = Boolean(session?.isFree);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-fg">Your session</h3>

        <dl className="mt-4 space-y-3 text-sm">
          <SummaryItem label="Area" value={category?.title} />
          <SummaryItem
            label="Session"
            value={
              session
                ? `${session.title} · ${formatDuration(session.durationMin)}`
                : undefined
            }
          />
          <SummaryItem
            label="Meeting"
            value={meetingOptions.find((o) => o.value === meetingProvider)?.label}
          />
          <SummaryItem label="Date" value={date ? formatDateLong(date) : undefined} />
          <SummaryItem
            label="Time"
            value={
              startMinutes !== undefined && session
                ? `${formatRange(startMinutes, session.durationMin)} IST`
                : undefined
            }
          />
        </dl>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-medium text-fg">Total</span>
          <span
            className={cn(
              "text-lg font-semibold tracking-tight",
              isFree ? "text-success" : "text-fg",
            )}
          >
            {session ? (isFree ? "Free" : formatInr(session.priceInr)) : "—"}
          </span>
        </div>

        <ul className="mt-5 space-y-2.5 border-t border-line pt-4 text-xs text-fg-muted">
          {[
            `1-to-1 with ${site.name}, not a group call`,
            "Free reschedule up to 12 hours before",
            isFree
              ? "No payment and no card details required"
              : "Full refund if you cancel 24 hours ahead",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                strokeWidth={1.9}
              />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs text-fg-subtle">{label}</dt>
      <dd
        className={cn(
          "text-right text-xs font-medium",
          value ? "text-fg" : "text-fg-subtle/70",
        )}
      >
        {value ?? "Not chosen yet"}
      </dd>
    </div>
  );
}

/* --- Razorpay script loader ------------------------------------------------ */

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("load failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("load failed"));
    document.body.appendChild(script);
  });
}
