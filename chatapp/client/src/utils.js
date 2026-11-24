export const initials = (name = "?") => name.trim().slice(0, 2).toUpperCase();

// Stable colour per name so each person keeps the same avatar colour
export const colorFor = (name = "") => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 55% 45%)`;
};

export const timeOf = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
