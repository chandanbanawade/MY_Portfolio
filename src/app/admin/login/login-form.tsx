"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { loginAction, type ActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, Field, Input, Alert, Spinner } from "@/components/ui/primitives";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Spinner /> Signing in…
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" strokeWidth={2} />
          Sign in
        </>
      )}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-4">
        {state.error && <Alert tone="danger">{state.error}</Alert>}

        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>

        <SubmitButton />
      </form>
    </Card>
  );
}
