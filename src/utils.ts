import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const getTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const stringToSlug = (str: string): string => {
  if (!str) return "";
  return encodeURIComponent(str.replace(/\s+/g, "_"));
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
