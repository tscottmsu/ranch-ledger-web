import type { Guest } from "@/features/guests/types";
import type { Saddle } from "../types";

export type SaddleRecommendation = { saddle: Saddle; score: number; reason: string };

function inRange(value: number | null, min: number | null, max: number | null) {
  if (value === null) return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return min !== null || max !== null;
}

function hasRange(min: number | null, max: number | null) {
  return min !== null || max !== null;
}

export function getSaddleRecommendations(guest: Pick<Guest, "height_inches" | "weight_lbs">, saddles: Saddle[]): { message: string | null; recommendations: SaddleRecommendation[] } {
  const active = saddles.filter((saddle) => saddle.status === "active" && !saddle.archived_at);
  if (!guest.height_inches && !guest.weight_lbs) return { message: "Add height and weight to recommend saddles.", recommendations: active.filter((saddle) => !hasRange(saddle.rider_height_min, saddle.rider_height_max) && !hasRange(saddle.rider_weight_min, saddle.rider_weight_max)).map((saddle) => ({ saddle, score: 0, reason: "Manual fallback" })) };
  const scored = active.map((saddle) => {
    const heightMatch = inRange(guest.height_inches, saddle.rider_height_min, saddle.rider_height_max);
    const weightMatch = inRange(guest.weight_lbs, saddle.rider_weight_min, saddle.rider_weight_max);
    const noFitRange = !hasRange(saddle.rider_height_min, saddle.rider_height_max) && !hasRange(saddle.rider_weight_min, saddle.rider_weight_max);
    const score = heightMatch && weightMatch ? 3 : heightMatch || weightMatch ? 2 : noFitRange ? 1 : 0;
    const reason = score === 3 ? "Height and weight match" : score === 2 ? "Partial fit match" : "Manual fallback";
    return { saddle, score, reason };
  }).filter((item) => item.score > 0).sort((left, right) => right.score - left.score || left.saddle.name.localeCompare(right.saddle.name));
  return { message: scored.length ? null : "No saddle match found. Choose manually.", recommendations: scored };
}
