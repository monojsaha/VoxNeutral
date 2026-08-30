import { type HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "brand"
  | "excellent"
  | "good"
  | "fair"
  | "developing"
  | "needs_work";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-800 text-neutral-300 border-neutral-700",
  success: "bg-success-500/15 text-success-500 border-success-500/30",
  warning: "bg-warning-500/15 text-warning-500 border-warning-500/30",
  error: "bg-error-500/15 text-error-500 border-error-500/30",
  brand: "bg-brand-500/15 text-brand-400 border-brand-500/30",
  excellent: "bg-success-500/15 text-success-500 border-success-500/30",
  good: "bg-brand-500/15 text-brand-400 border-brand-500/30",
  fair: "bg-warning-500/15 text-warning-500 border-warning-500/30",
  developing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  needs_work: "bg-error-500/15 text-error-500 border-error-500/30",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
