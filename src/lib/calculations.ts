import {
  ConsensusRow,
  Feature,
  MethodId,
  MoscowCategory,
  ScoreResult,
} from "./types";

const isNum = (v: number | null | undefined): v is number =>
  typeof v === "number" && !Number.isNaN(v);

const moscowWeight = (c: MoscowCategory | null): number | null => {
  if (!c) return null;
  switch (c) {
    case "must":
      return 100;
    case "should":
      return 66;
    case "could":
      return 33;
    case "wont":
      return 0;
  }
};

const rawScoreByMethod = (f: Feature, m: MethodId): number | null => {
  switch (m) {
    case "moscow":
      return moscowWeight(f.moscow);
    case "rice": {
      const { reach, impact, confidence, effort } = f.rice;
      if (!isNum(reach) || !isNum(impact) || !isNum(confidence) || !isNum(effort)) return null;
      if (effort <= 0) return null;
      return (reach * impact * (confidence / 100)) / effort;
    }
    case "ice": {
      const { impact, confidence, ease } = f.ice;
      if (!isNum(impact) || !isNum(confidence) || !isNum(ease)) return null;
      return impact * confidence * ease;
    }
    case "ve": {
      const { value, effort } = f.ve;
      if (!isNum(value) || !isNum(effort)) return null;
      if (effort <= 0) return null;
      return value / effort;
    }
  }
};

const isFeatureCompleteForMethod = (f: Feature, m: MethodId): boolean => {
  switch (m) {
    case "moscow":
      return f.moscow !== null;
    case "rice":
      return (
        isNum(f.rice.reach) &&
        isNum(f.rice.impact) &&
        isNum(f.rice.confidence) &&
        isNum(f.rice.effort) &&
        f.rice.effort > 0 &&
        f.rice.reach >= 0 &&
        f.rice.confidence >= 0 &&
        f.rice.confidence <= 100
      );
    case "ice":
      return (
        isNum(f.ice.impact) &&
        isNum(f.ice.confidence) &&
        isNum(f.ice.ease) &&
        f.ice.impact >= 1 &&
        f.ice.impact <= 10 &&
        f.ice.confidence >= 1 &&
        f.ice.confidence <= 10 &&
        f.ice.ease >= 1 &&
        f.ice.ease <= 10
      );
    case "ve":
      return (
        isNum(f.ve.value) &&
        isNum(f.ve.effort) &&
        f.ve.value >= 1 &&
        f.ve.value <= 10 &&
        f.ve.effort >= 1 &&
        f.ve.effort <= 10
      );
  }
};

export const allValid = (features: Feature[], methods: MethodId[]): boolean => {
  if (features.length === 0 || methods.length === 0) return false;
  return features.every((f) => methods.every((m) => isFeatureCompleteForMethod(f, m)));
};

export const computeConsensus = (
  features: Feature[],
  methods: MethodId[]
): ConsensusRow[] => {
  if (features.length === 0 || methods.length === 0) {
    return features.map((f) => ({
      feature: f,
      perMethod: {} as Record<MethodId, ScoreResult>,
      consensus: null,
      valid: false,
    }));
  }

  const rawByMethod: Record<string, Record<string, number | null>> = {};
  for (const m of methods) {
    rawByMethod[m] = {};
    for (const f of features) {
      rawByMethod[m][f.id] = rawScoreByMethod(f, m);
    }
  }

  const normalizedByMethod: Record<string, Record<string, number | null>> = {};
  for (const m of methods) {
    const values = features
      .map((f) => rawByMethod[m][f.id])
      .filter((v): v is number => isNum(v));

    if (values.length === 0) {
      normalizedByMethod[m] = Object.fromEntries(features.map((f) => [f.id, null]));
      continue;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    normalizedByMethod[m] = Object.fromEntries(
      features.map((f) => {
        const v = rawByMethod[m][f.id];
        if (!isNum(v)) return [f.id, null];
        if (range === 0) return [f.id, 100];
        return [f.id, ((v - min) / range) * 100];
      })
    );
  }

  return features
    .map<ConsensusRow>((f) => {
      const perMethod: Record<MethodId, ScoreResult> = {} as Record<
        MethodId,
        ScoreResult
      >;
      const normalizedPoints: number[] = [];
      let allMethodsValid = true;

      for (const m of methods) {
        const raw = rawByMethod[m][f.id];
        const normalized = normalizedByMethod[m][f.id];
        const valid = isFeatureCompleteForMethod(f, m);
        if (!valid) allMethodsValid = false;
        perMethod[m] = {
          featureId: f.id,
          raw,
          normalized,
          valid,
        };
        if (isNum(normalized)) normalizedPoints.push(normalized);
      }

      const consensus =
        normalizedPoints.length > 0
          ? normalizedPoints.reduce((a, b) => a + b, 0) / normalizedPoints.length
          : null;

      return {
        feature: f,
        perMethod,
        consensus,
        valid: allMethodsValid,
      };
    })
    .sort((a, b) => {
      const ac = a.consensus ?? -Infinity;
      const bc = b.consensus ?? -Infinity;
      return bc - ac;
    });
};

export const isFeatureFieldValid = (
  f: Feature,
  m: MethodId,
  field: string
): boolean => {
  switch (m) {
    case "moscow":
      return f.moscow !== null;
    case "rice": {
      const v = f.rice[field as keyof typeof f.rice];
      if (!isNum(v)) return false;
      if (field === "confidence") return v >= 0 && v <= 100;
      if (field === "effort") return v > 0;
      if (field === "reach") return v >= 0;
      return true;
    }
    case "ice": {
      const v = f.ice[field as keyof typeof f.ice];
      return isNum(v) && v >= 1 && v <= 10;
    }
    case "ve": {
      const v = f.ve[field as keyof typeof f.ve];
      return isNum(v) && v >= 1 && v <= 10;
    }
  }
};
