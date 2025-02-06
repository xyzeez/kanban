export const stringToSlug = (str: string): string => {
  if (!str) return "";
  return encodeURIComponent(str.replace(/\s+/g, "_"));
};
