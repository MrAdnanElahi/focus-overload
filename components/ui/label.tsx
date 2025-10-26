"use client";
import * as React from "react";
export function Label({ className="", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>){
  return <label className={`text-xs text-muted-foreground ${className}`} {...props} />;
}
export default Label;
