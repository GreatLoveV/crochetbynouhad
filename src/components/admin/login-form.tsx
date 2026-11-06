"use client";

import { useActionState } from "react";
import { Loader2Icon } from "lucide-react";

import { loginAction, type LoginState } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { strings } from "@/lib/constants/strings";

const initialState: LoginState = {};

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="from" value={from} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{strings.admin.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="admin@crochetbynouhad.ma"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{strings.admin.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon className="animate-spin" />
            {strings.admin.signingIn}
          </>
        ) : (
          strings.admin.signIn
        )}
      </Button>
    </form>
  );
}