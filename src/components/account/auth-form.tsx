'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccountStore } from '@/store/account-store';
import { email as emailRule, minLength, required, validateForm } from '@/lib/validation';

/**
 * Sign in / sign up. MOCK ONLY — no real auth. Credentials are validated for
 * shape (a plausible email, a long-enough password) and then the account store
 * records a client-side "logged in" user. Nothing is sent anywhere and no
 * password is stored, so this must never be treated as real security.
 */
export function AuthForm() {
  const signIn = useAccountStore((s) => s.signIn);
  const signUp = useAccountStore((s) => s.signUp);

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface-raised p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Your account</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Sign in to track orders and save your details.
      </p>

      <Tabs defaultValue="signin" className="mt-6">
        <TabsList>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <SignInForm onSubmit={(email) => signIn(email)} />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm onSubmit={(name, email) => signUp(name, email)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SignInForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});

  const validators = {
    email: emailRule,
    password: minLength(6, 'Password'),
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(values, validators);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(values.email);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          value={values.email}
          invalid={!!errors.email}
          aria-describedby={errors.email ? 'signin-email-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        <FieldError id="signin-email-error">{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          invalid={!!errors.password}
          aria-describedby={errors.password ? 'signin-password-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        />
        <FieldError id="signin-password-error">{errors.password}</FieldError>
      </div>
      <Button type="submit" size="lg" className="w-full">
        Sign in
      </Button>
    </form>
  );
}

function SignUpForm({ onSubmit }: { onSubmit: (name: string, email: string) => void }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'password', string>>>({});

  const validators = {
    name: required('Name'),
    email: emailRule,
    password: minLength(6, 'Password'),
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(values, validators);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(values.name, values.email);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          autoComplete="name"
          value={values.name}
          invalid={!!errors.name}
          aria-describedby={errors.name ? 'signup-name-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
        <FieldError id="signup-name-error">{errors.name}</FieldError>
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={values.email}
          invalid={!!errors.email}
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        <FieldError id="signup-email-error">{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          invalid={!!errors.password}
          aria-describedby={errors.password ? 'signup-password-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        />
        <FieldError id="signup-password-error">{errors.password}</FieldError>
      </div>
      <Button type="submit" size="lg" className="w-full">
        Create account
      </Button>
    </form>
  );
}
