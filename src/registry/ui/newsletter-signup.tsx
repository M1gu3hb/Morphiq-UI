"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const newsletterSignupVariants = cva(
  [
    "w-full border text-[color:var(--mq-news-text,#33261e)]",
    "bg-[var(--mq-news-bg,#f6e7dd)] border-[var(--mq-news-border,rgba(120,80,55,0.24))]",
    "[--mq-news-bg:#f6e7dd] [--mq-news-field:#fffaf6] [--mq-news-text:#33261e]",
    "[--mq-news-muted:#665044] [--mq-news-accent:#9f321f] [--mq-news-accent-text:#ffffff]",
    "[--mq-news-border:rgba(120,80,55,0.24)] [--mq-news-ring:#171817] [--mq-news-danger:#8f1f16]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay:
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-6px_10px_rgba(140,90,60,0.12),0_8px_0_#dcc4b2,0_22px_38px_rgba(90,60,45,0.18)]",
        glass:
          "[--mq-news-bg:rgba(255,255,255,0.78)] [--mq-news-field:rgba(255,255,255,0.88)] [--mq-news-text:#1e1e1b] [--mq-news-muted:#3f3f38] [--mq-news-accent:#5030a8] [--mq-news-border:rgba(255,255,255,0.86)] backdrop-blur-[18px] backdrop-saturate-[170%] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_44px_rgba(24,20,40,0.22)]",
        skeuo:
          "[--mq-news-bg:#e6e3da] [--mq-news-field:#f7f5ef] [--mq-news-text:#23231f] [--mq-news-muted:#4a4943] [--mq-news-accent:#65472f] [--mq-news-border:rgba(25,25,23,0.3)] bg-[linear-gradient(180deg,#f6f4ee,var(--mq-news-bg,#e6e3da))] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-4px_7px_rgba(0,0,0,0.14),0_7px_0_#a8a49b,0_18px_28px_rgba(38,36,31,0.25)]",
        adaptive:
          "[--mq-news-bg:#ffffff] [--mq-news-field:#f6f5f1] [--mq-news-text:#1c1c19] [--mq-news-muted:#55554e] [--mq-news-accent:#5731b8] [--mq-news-border:rgba(23,24,23,0.2)] shadow-[0_2px_4px_rgba(20,20,18,0.08),0_20px_44px_rgba(20,20,18,0.12)] dark:[--mq-news-bg:#232327] dark:[--mq-news-field:#18191d] dark:[--mq-news-text:#f1efe9] dark:[--mq-news-muted:#c1beb6] dark:[--mq-news-accent:#b9a1ff] dark:[--mq-news-accent-text:#17151d] dark:[--mq-news-border:rgba(255,255,255,0.22)] dark:[--mq-news-danger:#ffafa3]",
      },
      variant: {
        stacked: "text-center",
        inline: "",
      },
      size: {
        sm: "rounded-[22px] p-5 md:p-7",
        md: "rounded-[28px] p-6 md:p-9",
        lg: "rounded-[34px] p-7 md:p-12",
      },
    },
    defaultVariants: { material: "clay", variant: "stacked", size: "md" },
  },
);

export type NewsletterStatus = "idle" | "sending" | "success" | "error";

export type NewsletterSignupProps = Omit<React.ComponentPropsWithoutRef<"section">, "onSubmit"> &
  VariantProps<typeof newsletterSignupVariants> & {
    eyebrow?: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    buttonLabel?: string;
    status?: NewsletterStatus;
    disabled?: boolean;
    onSubmit?: (email: string) => void | Promise<void>;
  };

export function NewsletterSignup({
  buttonLabel = "Join the list",
  className,
  description = "One thoughtful dispatch each month. Product craft, tactile UI, and no noise.",
  disabled = false,
  eyebrow = "Field notes",
  heading = "Useful ideas, delivered calmly.",
  material,
  onSubmit,
  size,
  status,
  variant,
  ...props
}: NewsletterSignupProps) {
  const headingId = React.useId();
  const emailId = React.useId();
  const messageId = React.useId();
  const [email, setEmail] = React.useState("");
  const [internalStatus, setInternalStatus] = React.useState<NewsletterStatus>("idle");
  const currentStatus = status ?? internalStatus;
  const busy = currentStatus === "sending";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || busy) return;
    if (!event.currentTarget.checkValidity()) {
      setInternalStatus("error");
      event.currentTarget.reportValidity();
      return;
    }
    setInternalStatus("sending");
    try {
      await onSubmit?.(email);
      setInternalStatus("success");
    } catch {
      setInternalStatus("error");
    }
  };

  const message =
    currentStatus === "success"
      ? "You are subscribed. Check your inbox for confirmation."
      : currentStatus === "error"
        ? "We could not subscribe this address. Check it and try again."
        : "";

  return (
    <section
      aria-labelledby={headingId}
      className={cn(newsletterSignupVariants({ material, variant, size }), className)}
      {...props}
    >
      <div className={cn("mx-auto max-w-[780px]", variant === "inline" && "lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-10")}>
        <div>
          <span
            aria-hidden="true"
            className={cn(
              "grid size-11 place-items-center rounded-[14px] bg-[var(--mq-news-accent,#9f321f)] text-[var(--mq-news-accent-text,#ffffff)] forced-colors:border forced-colors:border-[CanvasText]",
              variant === "stacked" && "mx-auto",
            )}
          >
            <Mail className="size-5" />
          </span>
          <p className="mt-4 text-xs font-black tracking-[0.15em] text-[var(--mq-news-accent,#9f321f)] uppercase">
            {eyebrow}
          </p>
          <h2
            className="mt-3 text-balance text-[clamp(2rem,5vw,3.4rem)]/[1.02] font-black tracking-[-0.055em]"
            id={headingId}
          >
            {heading}
          </h2>
          <p className="mt-4 text-[15px]/[1.65] text-[var(--mq-news-muted,#665044)]">{description}</p>
        </div>

        <form className={cn("mt-7", variant === "inline" && "lg:mt-0")} noValidate onSubmit={submit}>
          <label className="block text-left text-sm font-extrabold" htmlFor={emailId}>
            Email address
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              aria-describedby={message ? messageId : undefined}
              aria-invalid={currentStatus === "error" || undefined}
              autoComplete="email"
              className="min-h-12 min-w-0 flex-1 rounded-[14px] border border-[var(--mq-news-border,rgba(120,80,55,0.24))] bg-[var(--mq-news-field,#fffaf6)] px-4 text-base text-[var(--mq-news-text,#33261e)] outline-none placeholder:text-[var(--mq-news-muted,#665044)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-news-ring,#171817)] disabled:cursor-not-allowed disabled:opacity-55 forced-colors:border-[FieldText] forced-colors:bg-[Field]"
              disabled={disabled || busy}
              id={emailId}
              inputMode="email"
              onChange={(event) => {
                setEmail(event.target.value);
                if (internalStatus === "error") setInternalStatus("idle");
              }}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--mq-news-accent,#9f321f)] bg-[var(--mq-news-accent,#9f321f)] px-5 font-extrabold text-[var(--mq-news-accent-text,#ffffff)] transition-[box-shadow,filter] duration-200 hover:brightness-[1.08] hover:shadow-[0_8px_22px_rgba(87,49,35,0.24)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--mq-news-ring,#171817)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-55 forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]"
              disabled={disabled || busy}
              type="submit"
            >
              {busy ? <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin motion-reduce:animate-none" /> : null}
              <span>{busy ? "Sending" : buttonLabel}</span>
              {!busy ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
            </button>
          </div>
          <p
            aria-live="polite"
            className={cn(
              "mt-3 flex min-h-6 items-center gap-2 text-left text-sm font-bold",
              currentStatus === "error" ? "text-[var(--mq-news-danger,#8f1f16)]" : "text-[var(--mq-news-muted,#665044)]",
            )}
            id={messageId}
          >
            {currentStatus === "success" ? <CheckCircle2 aria-hidden="true" className="size-4" /> : null}
            {currentStatus === "error" ? <TriangleAlert aria-hidden="true" className="size-4" /> : null}
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}

export { newsletterSignupVariants };
