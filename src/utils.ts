export const getTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const slugToString = (slug: string): string => {
  const decoded = decodeURIComponent(slug);
  return decoded.replace(/_/g, " ");
};
