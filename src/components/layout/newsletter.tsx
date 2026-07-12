'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { email as emailRule } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input, FieldError } from '@/components/ui/input';

/**
 * Newsletter sign-up. Client-side only — validates the address and shows a
 * success state. There is no email service behind it; the interaction is
 * complete on its own terms (validate → confirm) rather than posting anywhere.
 */
export function Newsletter() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = emailRule(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success-subtle p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">You’re on the list</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Thanks for subscribing — look out for new arrivals and offers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 className="text-sm font-semibold text-ink">Stay in the loop</h2>
      <p className="mt-1 text-sm text-ink-muted">
        New arrivals, offers and restocks — straight to your inbox.
      </p>
      <div className="mt-3 flex gap-2">
        <Input
          type="email"
          name="email"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          autoComplete="email"
          invalid={!!error}
          aria-label="Email address"
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="flex-1"
        />
        <Button type="submit" aria-label="Subscribe">
          <Send className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Subscribe</span>
        </Button>
      </div>
      <FieldError id="newsletter-error">{error}</FieldError>
    </form>
  );
}
