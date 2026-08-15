"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarOff, Plus } from "lucide-react";
import {
  addAvailabilityRuleAction,
  addBlockedDateAction,
  type ActionState,
} from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, Field, Input, Select, Spinner } from "@/components/ui/primitives";
import { dayNames } from "@/config/availability";

function SubmitButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Spinner /> Saving…
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (state.error) return <p className="text-sm text-danger">{state.error}</p>;
  if (state.success) return <p className="text-sm text-success">{state.success}</p>;
  return null;
}

export function AvailabilityForms() {
  const [windowState, addWindow] = useActionState<ActionState, FormData>(
    addAvailabilityRuleAction,
    {},
  );
  const [blockState, addBlock] = useActionState<ActionState, FormData>(
    addBlockedDateAction,
    {},
  );

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-fg">Add a weekly window</h2>
        <p className="mt-1 text-xs text-fg-muted">
          Repeats every week until you remove it.
        </p>

        <form action={addWindow} className="mt-4 space-y-3">
          <Field label="Day" htmlFor="dayOfWeek">
            <Select id="dayOfWeek" name="dayOfWeek" defaultValue="1">
              {dayNames.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="From" htmlFor="start">
              <Input id="start" name="start" type="time" defaultValue="19:00" required />
            </Field>
            <Field label="To" htmlFor="end">
              <Input id="end" name="end" type="time" defaultValue="22:00" required />
            </Field>
          </div>

          <Feedback state={windowState} />
          <SubmitButton
            label="Add window"
            icon={<Plus className="h-4 w-4" strokeWidth={2} />}
          />
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-fg">Block a date</h2>
        <p className="mt-1 text-xs text-fg-muted">
          Removes every slot on that day. Existing bookings are not cancelled —
          cancel those from the Bookings page.
        </p>

        <form action={addBlock} className="mt-4 space-y-3">
          <Field label="Date" htmlFor="date">
            <Input id="date" name="date" type="date" required />
          </Field>

          <Field label="Reason" hint="Optional" htmlFor="reason">
            <Input id="reason" name="reason" placeholder="Travelling, holiday…" />
          </Field>

          <Feedback state={blockState} />
          <SubmitButton
            label="Block date"
            icon={<CalendarOff className="h-4 w-4" strokeWidth={2} />}
          />
        </form>
      </Card>
    </div>
  );
}
