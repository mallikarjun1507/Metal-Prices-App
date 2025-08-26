const tz = "Asia/Kolkata";

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-IN", { timeZone: tz });
}
export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", { timeZone: tz });
}
export function formatFull(ts) {
  const d = formatDate(ts);
  const t = formatTime(ts);
  return `${d} ${t}`;
}
export default { formatDate, formatTime, formatFull };
