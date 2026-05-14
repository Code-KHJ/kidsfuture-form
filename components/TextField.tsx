"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-ink">{label}</span>
      {hint && <span className="ml-2 text-xs text-brand-mute">{hint}</span>}
      <input
        {...props}
        className={cn(
          "mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-brand-ink outline-none transition placeholder:text-brand-mute/60",
          error
            ? "border-brand-coral/70 focus:border-brand-coral"
            : "border-brand-line focus:border-brand-ink",
          className
        )}
      />
      {error && (
        <span className="mt-1.5 inline-block text-xs font-medium text-brand-coral">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-ink">{label}</span>
      {hint && <span className="ml-2 text-xs text-brand-mute">{hint}</span>}
      <textarea
        {...props}
        className={cn(
          "mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-3.5 text-base text-brand-ink outline-none transition placeholder:text-brand-mute/60",
          error
            ? "border-brand-coral/70 focus:border-brand-coral"
            : "border-brand-line focus:border-brand-ink",
          className
        )}
      />
      {error && (
        <span className="mt-1.5 inline-block text-xs font-medium text-brand-coral">
          {error}
        </span>
      )}
    </label>
  );
}
