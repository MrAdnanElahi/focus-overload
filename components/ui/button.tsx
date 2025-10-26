"use client";
import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "destructive", size?: "sm" | "md" };
export function Button({ variant="default", size="md", className="", ...props }: Props){
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition border border-transparent";
  const sizes = size==="sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2";
  const variants = {
    default: "bg-primary text-white hover:opacity-90",
    secondary: "bg-muted text-foreground hover:bg-muted/80 border-border",
    destructive: "bg-red-600 text-white hover:bg-red-600/90"
  }[variant];
  return <button className={`${base} ${sizes} ${variants} ${className}`} {...props} />;
}
export default Button;
