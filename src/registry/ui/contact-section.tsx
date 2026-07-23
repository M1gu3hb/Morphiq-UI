"use client";

import * as React from "react";
import { ArrowRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const contactSectionVariants = cva(
  [
    "w-full border bg-[var(--mq-contact-bg,#f6f3ec)] text-[color:var(--mq-contact-text,#201f1b)]",
    "border-[var(--mq-contact-border,#89857b)] [--mq-contact-bg:#f6f3ec] [--mq-contact-card:#ffffff]",
    "[--mq-contact-field:#fbfaf7] [--mq-contact-text:#201f1b] [--mq-contact-muted:#555249]",
    "[--mq-contact-accent:#5731b8] [--mq-contact-accent-text:#ffffff] [--mq-contact-border:#89857b]",
    "[--mq-contact-danger:#8f1f16]",
    "dark:[--mq-contact-bg:#191a1e] dark:[--mq-contact-card:#26272c] dark:[--mq-contact-field:#1f2024]",
    "dark:[--mq-contact-text:#f6f3ec] dark:[--mq-contact-muted:#c5c1b8] dark:[--mq-contact-accent:#b9a1ff]",
    "dark:[--mq-contact-accent-text:#17151d] dark:[--mq-contact-border:#918d84] dark:[--mq-contact-danger:#ffafa3]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        split: "lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-10",
        stacked: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { variant: "split", size: "md" },
  },
);

type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;
type ContactPayload = { name: string; email: string; message: string };

export type ContactSectionProps = Omit<React.ComponentPropsWithoutRef<"section">, "onSubmit"> &
  VariantProps<typeof contactSectionVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    onSubmit?: (payload: ContactPayload) => void | Promise<void>;
  };

export function ContactSection({
  className,
  description = "Tell us what you are building and where the experience needs more clarity.",
  disabled = false,
  eyebrow = "Start a conversation",
  heading = "Bring the next idea into focus",
  onSubmit,
  size,
  variant,
  ...props
}: ContactSectionProps) {
  const headingId = React.useId();
  const nameId = React.useId();
  const emailId = React.useId();
  const messageId = React.useId();
  const statusId = React.useId();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);
  const [values, setValues] = React.useState<ContactPayload>({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState<ContactErrors>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || status === "sending") return;
    const nextErrors: ContactErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (values.message.trim().length < 12) nextErrors.message = "Add at least 12 characters so we can understand the request.";
    setErrors(nextErrors);
    const firstError = (["name", "email", "message"] as const).find((field) => nextErrors[field]);
    if (firstError) {
      ({ name: nameRef, email: emailRef, message: messageRef })[firstError].current?.focus();
      return;
    }
    setStatus("sending");
    try {
      await onSubmit?.(values);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "mt-2 min-h-12 w-full rounded-[14px] border border-[var(--mq-contact-border,#89857b)] bg-[var(--mq-contact-field,#fbfaf7)] px-4 text-base text-[var(--mq-contact-text,#201f1b)] outline-none placeholder:text-[var(--mq-contact-muted,#555249)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-contact-accent,#5731b8)] disabled:cursor-not-allowed disabled:opacity-55 forced-colors:border-[FieldText] forced-colors:bg-[Field]";

  return (
    <section
      aria-labelledby={headingId}
      className={cn(contactSectionVariants({ variant, size }), className)}
      {...props}
    >
      <div>
        <p className="text-xs font-black tracking-[0.15em] text-[var(--mq-contact-accent,#5731b8)] uppercase">
          {eyebrow}
        </p>
        <h2
          className="mt-3 text-balance text-[clamp(2rem,5vw,3.6rem)]/[1.02] font-black tracking-[-0.055em]"
          id={headingId}
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-[52ch] text-[15px]/[1.65] text-[var(--mq-contact-muted,#555249)]">
          {description}
        </p>
        <ul className="mt-7 grid list-none gap-4 p-0">
          {[
            { icon: <Mail />, label: "Email", value: "hello@morphiq.dev" },
            { icon: <Phone />, label: "Phone", value: "+52 55 0000 0000" },
            { icon: <MapPin />, label: "Studio", value: "Mexico City · Remote worldwide" },
          ].map((item) => (
            <li className="flex items-start gap-3" key={item.label}>
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[var(--mq-contact-accent,#5731b8)] text-[var(--mq-contact-accent-text,#ffffff)] forced-colors:border forced-colors:border-[CanvasText] [&>svg]:size-4">
                {item.icon}
              </span>
              <span>
                <span className="block text-xs font-black tracking-[0.1em] text-[var(--mq-contact-muted,#555249)] uppercase">{item.label}</span>
                <span className="mt-1 block text-sm font-bold">{item.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form
        aria-describedby={statusId}
        className={cn(
          "mt-8 rounded-[22px] border border-[var(--mq-contact-border,#89857b)] bg-[var(--mq-contact-card,#ffffff)] p-5 shadow-[0_16px_36px_rgba(35,31,24,0.1)] forced-colors:shadow-none",
          variant === "split" && "lg:mt-0",
        )}
        noValidate
        onSubmit={submit}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-extrabold" htmlFor={nameId}>
            Name
            <input
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              className={fieldClass}
              disabled={disabled}
              id={nameId}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
              ref={nameRef}
              value={values.name}
            />
            {errors.name ? <span className="mt-2 block text-sm text-[var(--mq-contact-danger,#8f1f16)]" id={`${nameId}-error`}>{errors.name}</span> : null}
          </label>
          <label className="text-sm font-extrabold" htmlFor={emailId}>
            Email
            <input
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className={fieldClass}
              disabled={disabled}
              id={emailId}
              inputMode="email"
              onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
              ref={emailRef}
              type="email"
              value={values.email}
            />
            {errors.email ? <span className="mt-2 block text-sm text-[var(--mq-contact-danger,#8f1f16)]" id={`${emailId}-error`}>{errors.email}</span> : null}
          </label>
        </div>
        <label className="mt-5 block text-sm font-extrabold" htmlFor={messageId}>
          Message
          <textarea
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            aria-invalid={Boolean(errors.message)}
            className={cn(fieldClass, "min-h-32 resize-y py-3")}
            disabled={disabled}
            id={messageId}
            onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
            ref={messageRef}
            value={values.message}
          />
          {errors.message ? <span className="mt-2 block text-sm text-[var(--mq-contact-danger,#8f1f16)]" id={`${messageId}-error`}>{errors.message}</span> : null}
        </label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            aria-live="polite"
            className={cn("min-h-6 text-sm font-bold text-[var(--mq-contact-muted,#555249)]", status === "error" && "text-[var(--mq-contact-danger,#8f1f16)]")}
            id={statusId}
          >
            {status === "success" ? "Message received. We will reply shortly." : status === "error" ? "The message could not be sent. Try again." : ""}
          </p>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-contact-accent,#5731b8)] bg-[var(--mq-contact-accent,#5731b8)] px-5 font-extrabold text-[var(--mq-contact-accent-text,#ffffff)] transition-[box-shadow,filter] duration-200 hover:brightness-[1.08] hover:shadow-[0_8px_22px_rgba(87,49,184,0.24)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-contact-accent,#5731b8)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-55 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
            disabled={disabled || status === "sending"}
            type="submit"
          >
            {status === "sending" ? <Send aria-hidden="true" className="size-4 motion-safe:animate-pulse motion-reduce:animate-none" /> : <ArrowRight aria-hidden="true" className="size-4" />}
            {status === "sending" ? "Sending" : "Send message"}
          </button>
        </div>
      </form>
    </section>
  );
}

export { contactSectionVariants };
