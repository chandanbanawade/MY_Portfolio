"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Gift, Save } from "lucide-react";
import { updateSessionTypeAction, type ActionState } from "../../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  Badge,
  Field,
  Input,
  Textarea,
  Spinner,
} from "@/components/ui/primitives";
import { meetingOptions } from "@/config/meetings";

type SessionRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  durationMin: number;
  priceInr: number;
  description: string;
  allowedProviders: string[];
  isFree: boolean;
  active: boolean;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <>
          <Spinner /> Saving…
        </>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" strokeWidth={2} />
          Save changes
        </>
      )}
    </Button>
  );
}

export function SessionEditor({ session }: { session: SessionRow }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateSessionTypeAction,
    {},
  );

  return (
    <Card className="overflow-hidden">
      <form action={formAction}>
        <input type="hidden" name="id" value={session.id} />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-5 py-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs text-fg-subtle">{session.slug}</span>
            {session.isFree && (
              <Badge tone="success">
                <Gift className="h-3 w-3" strokeWidth={2} />
                Free consultation
              </Badge>
            )}
            <Badge tone={session.active ? "success" : "neutral"}>
              {session.active ? "Live" : "Hidden"}
            </Badge>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              name="active"
              defaultChecked={session.active}
              className="h-4 w-4 rounded border-line accent-[var(--accent)]"
            />
            Show on site
          </label>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <Field label="Title" htmlFor={`title-${session.id}`}>
            <Input
              id={`title-${session.id}`}
              name="title"
              defaultValue={session.title}
              required
            />
          </Field>

          <Field label="Tagline" htmlFor={`tagline-${session.id}`}>
            <Input
              id={`tagline-${session.id}`}
              name="tagline"
              defaultValue={session.tagline}
            />
          </Field>

          <Field label="Duration" hint="minutes" htmlFor={`duration-${session.id}`}>
            <Input
              id={`duration-${session.id}`}
              name="durationMin"
              type="number"
              min={5}
              max={480}
              defaultValue={session.durationMin}
              required
            />
          </Field>

          <Field
            label="Price"
            hint={session.isFree ? "locked at ₹0" : "₹ INR"}
            htmlFor={`price-${session.id}`}
          >
            <Input
              id={`price-${session.id}`}
              name="priceInr"
              type="number"
              min={0}
              defaultValue={session.priceInr}
              readOnly={session.isFree}
              className={session.isFree ? "cursor-not-allowed opacity-60" : ""}
              required
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description" htmlFor={`desc-${session.id}`}>
              <Textarea
                id={`desc-${session.id}`}
                name="description"
                defaultValue={session.description}
                className="min-h-[80px]"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-fg">Meeting methods offered</p>
            <p className="mt-1 text-xs text-fg-subtle">
              What the visitor can choose from when booking this session.
            </p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {meetingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] border border-line bg-surface-2 px-3 py-2 text-sm text-fg-muted transition-colors hover:border-line-strong"
                >
                  <input
                    type="checkbox"
                    name="providers"
                    value={option.value}
                    defaultChecked={session.allowedProviders.includes(option.value)}
                    className="h-4 w-4 rounded border-line accent-[var(--accent)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-3">
          <div className="min-w-0 text-sm">
            {state.error && <span className="text-danger">{state.error}</span>}
            {state.success && <span className="text-success">{state.success}</span>}
          </div>
          <SaveButton />
        </div>
      </form>
    </Card>
  );
}
