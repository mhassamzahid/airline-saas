"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "link">("password");
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = EMAIL_RE.test(email);
  const canSubmit = mode === "link" ? emailValid : emailValid && password.length >= 6;

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[10px] border border-hairline bg-canvas p-6 text-center h-shadow-sm"
      >
        <EnvelopeSimple size={26} className="mx-auto text-rust-700" weight="fill" />
        <h2 className="mt-3 text-[17px] font-semibold text-ink">Check your inbox</h2>
        <p className="mt-1.5 text-[14px] text-body">
          If <span className="text-ink">{email}</span> has a Halcyon account, a sign-in
          link is on its way. It expires in 15 minutes.
        </p>
        <p className="mt-4 text-[12px] text-muted">
          Prototype note: no email is actually sent.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[10px] border border-hairline bg-canvas p-6 h-shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (canSubmit) setSent(true);
        }}
        className="flex flex-col gap-4"
      >
        <Field
          label="Email"
          error={touched && !emailValid ? "Enter a valid email address" : undefined}
        >
          {(id) => (
            <TextInput
              id={id}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          )}
        </Field>

        {mode === "password" && (
          <Field
            label="Password"
            error={
              touched && password.length > 0 && password.length < 6
                ? "At least 6 characters"
                : undefined
            }
          >
            {(id) => (
              <TextInput
                id={id}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            )}
          </Field>
        )}

        <Button type="submit" disabled={!canSubmit} className="mt-1 w-full">
          {mode === "link" ? "Email me a sign-in link" : "Continue"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-[13px]">
        <button
          onClick={() => setMode(mode === "password" ? "link" : "password")}
          className="font-medium text-rust-700 hover:text-rust-600"
        >
          {mode === "password" ? "Use a sign-in link instead" : "Use a password instead"}
        </button>
        {mode === "password" && (
          <Link href="/" className="text-muted hover:text-body">
            Forgot password
          </Link>
        )}
      </div>
    </div>
  );
}
