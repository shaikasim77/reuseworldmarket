export type Coordinates = { latitude: number; longitude: number };
export function distanceKm(a: Coordinates, b: Coordinates) {
  const radians = (n: number) => n * Math.PI / 180;
  const h = Math.sin(radians(b.latitude-a.latitude)/2)**2 + Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(radians(b.longitude-a.longitude)/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0,1-h)));
}
export function itemDistance(item: { latitude: number | null; longitude: number | null }, location: Coordinates | null) {
  return location && item.latitude !== null && item.longitude !== null ? distanceKm(location, { latitude: item.latitude, longitude: item.longitude }) : null;
}
export function donorLevel(points: number) {
  if (points >= 300) return { name: "Guardian", start: 300, next: null };
  if (points >= 150) return { name: "Giver", start: 150, next: 300 };
  if (points >= 50) return { name: "Helper", start: 50, next: 150 };
  return { name: "Seedling", start: 0, next: 50 };
}
export function canTransition(isOwner: boolean, from: string, to: string) {
  return isOwner && ((from === "pending" && ["accepted", "declined"].includes(to)) || (from === "accepted" && ["completed", "declined"].includes(to)));
}
export const awardPoints = { owner: 10, requester: 5 } as const;
export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} – Rebuy` }, { name: "description", content: description }, { property: "og:title", content: `${title} – Rebuy` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
}