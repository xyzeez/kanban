export const getTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const fromSlug = (slug: string): string => {
  const decoded = decodeURIComponent(slug);
  return decoded.replace(/-/g, " ");
};
