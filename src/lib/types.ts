export type MethodId = "moscow" | "rice" | "ice" | "ve";

export type MoscowCategory = "must" | "should" | "could" | "wont";

export interface RiceValues {
  reach: number | null;
  impact: number | null; // one of 0.25, 0.5, 1, 2, 3
  confidence: number | null; // %
  effort: number | null; // person-weeks
}

export interface IceValues {
  impact: number | null; // 1–10
  confidence: number | null; // 1–10
  ease: number | null; // 1–10
}

export interface VeValues {
  value: number | null; // 1–10
  effort: number | null; // 1–10
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  moscow: MoscowCategory | null;
  rice: RiceValues;
  ice: IceValues;
  ve: VeValues;
}

export interface ScoreResult {
  featureId: string;
  raw: number | null;
  normalized: number | null; // 0–100
  valid: boolean;
}

export interface ConsensusRow {
  feature: Feature;
  perMethod: Record<MethodId, ScoreResult>;
  consensus: number | null;
  valid: boolean;
}

export const METHOD_LABELS: Record<MethodId, string> = {
  moscow: "MoSCoW",
  rice: "RICE",
  ice: "ICE",
  ve: "Value vs Effort",
};

export const MOSCOW_LABELS: Record<MoscowCategory, string> = {
  must: "Must have",
  should: "Should have",
  could: "Could have",
  wont: "Won't have",
};

export const MAX_FEATURES = 20;

export const RICE_IMPACT_VALUES = [0.25, 0.5, 1, 2, 3] as const;
