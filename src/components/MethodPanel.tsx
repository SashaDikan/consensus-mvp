"use client";

import { useApp } from "../context/AppContext";
import {
  Feature,
  MAX_FEATURES,
  METHOD_LABELS,
  MOSCOW_LABELS,
  MethodId,
  MoscowCategory,
  RICE_IMPACT_VALUES,
} from "../lib/types";
import { isFeatureFieldValid, computeConsensus } from "../lib/calculations";
import { getMethodAccent, getMethodBg } from "./Tabs";

type Instruction = {
  summary: string;
  fields: Array<{ label: string; body: string }>;
  formula: string;
};

const INSTRUCTIONS: Record<MethodId, Instruction> = {
  moscow: {
    summary:
      "MoSCoW is a scope-setting method: for every feature, pick exactly one of four buckets. It doesn't produce a fine-grained ranking — it tells you what must ship versus what can wait.",
    fields: [
      { label: "Must have · 100", body: "Non-negotiable. Ship is incomplete without it." },
      { label: "Should have · 66", body: "Important, not critical. Can slip to the next release." },
      { label: "Could have · 33", body: "Nice-to-have. Ship if there's room." },
      { label: "Won't have · 0", body: "Explicitly out of scope for this cycle." },
    ],
    formula: "Score = fixed weight per bucket (100 / 66 / 33 / 0).",
  },
  rice: {
    summary:
      "RICE is a quantitative score for features where you can roughly estimate numbers. Fill all four inputs; higher score = ship first.",
    fields: [
      { label: "Reach", body: "People affected per period. Any integer ≥ 0. e.g. 1200 users/quarter." },
      { label: "Impact", body: "Per-user impact on success metric. Pick one: 0.25 minimal · 0.5 low · 1 medium · 2 high · 3 massive." },
      { label: "Confidence %", body: "How sure you are of the estimates. 50% low · 80% medium · 100% high." },
      { label: "Effort (weeks)", body: "Total person-weeks to build. Smaller is better." },
    ],
    formula: "Score = (Reach × Impact × Confidence%) ÷ Effort.",
  },
  ice: {
    summary:
      "ICE is a quick 1–10 rating on three dimensions. Best for rough back-of-napkin comparisons before you have real data.",
    fields: [
      { label: "Impact (1–10)", body: "How big the outcome will be if it works. 1 = marginal, 10 = category-defining." },
      { label: "Confidence (1–10)", body: "How sure you are the impact estimate is right. 1 = guessing, 10 = proven." },
      { label: "Ease (1–10)", body: "How simple to ship. 1 = multi-quarter, 10 = an afternoon." },
    ],
    formula: "Score = Impact × Confidence × Ease (max 1000).",
  },
  ve: {
    summary:
      "Value vs Effort plots each feature on a 2×2 matrix. Great for identifying Quick Wins (high value, low effort) vs Time Wasters.",
    fields: [
      { label: "Value (1–10)", body: "Business or user value. 1 = negligible, 10 = transformative." },
      { label: "Effort (1–10)", body: "Build effort. 1 = trivial, 10 = enormous." },
    ],
    formula: "Score = Value ÷ Effort. Quadrants: Quick Wins · Big Bets · Fill-ins · Time Wasters.",
  },
};

const MOSCOW_WEIGHT: Record<MoscowCategory, number> = {
  must: 100,
  should: 66,
  could: 33,
  wont: 0,
};

const numberOrNull = (v: string): number | null => {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const fmt = (n: number | null, digits = 1) =>
  n === null ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: digits });

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const MoscowCell = ({ feature }: { feature: Feature }) => {
  const { dispatch } = useApp();
  const cats: MoscowCategory[] = ["must", "should", "could", "wont"];
  return (
    <div className="flex flex-wrap gap-1.5">
      {cats.map((c) => {
        const on = feature.moscow === c;
        return (
          <button
            key={c}
            onClick={() =>
              dispatch({
                type: "SET_MOSCOW",
                id: feature.id,
                category: on ? null : c,
              })
            }
            className="font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full transition-all"
            style={{
              background: on ? "var(--ink)" : "rgba(255,255,255,0.7)",
              color: on ? "var(--paper)" : "var(--ink-soft)",
              fontWeight: on ? 600 : 500,
            }}
          >
            {MOSCOW_LABELS[c]} · {MOSCOW_WEIGHT[c]}
          </button>
        );
      })}
    </div>
  );
};

const NumInput = ({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  invalid,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  invalid: boolean;
}) => (
  <input
    type="number"
    min={min}
    max={max}
    step={step}
    className={`w-full px-2 py-1.5 rounded-md font-mono font-medium text-right text-[13px] outline-none ${
      invalid ? "ring-2 ring-red-500/40" : ""
    }`}
    style={{ background: "rgba(255,255,255,0.75)", color: "var(--ink)" }}
    placeholder={placeholder}
    value={value ?? ""}
    onChange={(e) => onChange(numberOrNull(e.target.value))}
  />
);

const RiceCell = ({ feature }: { feature: Feature }) => {
  const { dispatch } = useApp();
  const f = feature;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
      <div>
        <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
          Reach
        </label>
        <NumInput
          value={f.rice.reach}
          onChange={(v) => dispatch({ type: "SET_RICE_FIELD", id: f.id, field: "reach", value: v })}
          placeholder="1200"
          min={0}
          invalid={f.rice.reach !== null && !isFeatureFieldValid(f, "rice", "reach")}
        />
      </div>
      <div>
        <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
          Impact
        </label>
        <div className="flex gap-1 flex-wrap">
          {RICE_IMPACT_VALUES.map((v) => {
            const on = f.rice.impact === v;
            return (
              <button
                key={v}
                onClick={() =>
                  dispatch({
                    type: "SET_RICE_FIELD",
                    id: f.id,
                    field: "impact",
                    value: on ? null : v,
                  })
                }
                className="font-mono text-[10px] px-2 py-1 rounded-md transition"
                style={{
                  background: on ? "var(--ink)" : "rgba(255,255,255,0.75)",
                  color: on ? "var(--paper)" : "var(--ink-soft)",
                  fontWeight: on ? 600 : 500,
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
          Confidence %
        </label>
        <NumInput
          value={f.rice.confidence}
          onChange={(v) => dispatch({ type: "SET_RICE_FIELD", id: f.id, field: "confidence", value: v })}
          placeholder="80"
          min={0}
          max={100}
          invalid={f.rice.confidence !== null && !isFeatureFieldValid(f, "rice", "confidence")}
        />
      </div>
      <div>
        <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
          Effort (wks)
        </label>
        <NumInput
          value={f.rice.effort}
          onChange={(v) => dispatch({ type: "SET_RICE_FIELD", id: f.id, field: "effort", value: v })}
          placeholder="4"
          min={0.1}
          step={0.5}
          invalid={f.rice.effort !== null && !isFeatureFieldValid(f, "rice", "effort")}
        />
      </div>
    </div>
  );
};

const IceCell = ({ feature }: { feature: Feature }) => {
  const { dispatch } = useApp();
  const fields = [
    { k: "impact" as const, label: "Impact" },
    { k: "confidence" as const, label: "Confidence" },
    { k: "ease" as const, label: "Ease" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {fields.map(({ k, label }) => (
        <div key={k}>
          <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
            {label} (1–10)
          </label>
          <NumInput
            value={feature.ice[k]}
            onChange={(v) => dispatch({ type: "SET_ICE_FIELD", id: feature.id, field: k, value: v })}
            placeholder="1–10"
            min={1}
            max={10}
            step={1}
            invalid={feature.ice[k] !== null && !isFeatureFieldValid(feature, "ice", k)}
          />
        </div>
      ))}
    </div>
  );
};

const VeCell = ({ feature }: { feature: Feature }) => {
  const { dispatch } = useApp();
  const fields = [
    { k: "value" as const, label: "Value" },
    { k: "effort" as const, label: "Effort" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {fields.map(({ k, label }) => (
        <div key={k}>
          <label className="font-mono text-[9px] uppercase tracking-[0.12em] block mb-1" style={{ color: "var(--muted)" }}>
            {label} (1–10)
          </label>
          <NumInput
            value={feature.ve[k]}
            onChange={(v) => dispatch({ type: "SET_VE_FIELD", id: feature.id, field: k, value: v })}
            placeholder="1–10"
            min={1}
            max={10}
            step={1}
            invalid={feature.ve[k] !== null && !isFeatureFieldValid(feature, "ve", k)}
          />
        </div>
      ))}
    </div>
  );
};

const quadrantFor = (v: number, e: number) => {
  const hi = (x: number) => x >= 6;
  if (hi(v) && !hi(e)) return "Quick Win";
  if (hi(v) && hi(e)) return "Big Bet";
  if (!hi(v) && !hi(e)) return "Fill-in";
  return "Time Waster";
};

const InlineScore = ({
  feature,
  method,
  accent,
}: {
  feature: Feature;
  method: MethodId;
  accent: string;
}) => {
  // MoSCoW: show the raw bucket weight (100/66/33/0) — intuitive, not a normalized pct
  if (method === "moscow") {
    if (!feature.moscow) {
      return (
        <div className="flex flex-col items-end min-w-[72px]">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
            Score
          </span>
          <span className="font-display text-[22px] leading-none" style={{ color: "var(--muted)" }}>
            —
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-end min-w-[72px]">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
          Score
        </span>
        <span className="font-display font-medium text-[22px] leading-none" style={{ color: accent }}>
          {MOSCOW_WEIGHT[feature.moscow]}
        </span>
      </div>
    );
  }

  // RICE / ICE / VE: show the raw formula result; compact
  const rows = computeConsensus([feature], [method]);
  const s = rows[0]?.perMethod?.[method];
  const valid = rows[0]?.valid;

  let hint = "";
  if (valid && method === "ve" && feature.ve.value && feature.ve.effort) {
    hint = quadrantFor(feature.ve.value, feature.ve.effort);
  }

  return (
    <div className="flex flex-col items-end min-w-[88px]">
      <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
        Score
      </span>
      <span
        className="font-display font-medium text-[22px] leading-none"
        style={{ color: valid ? accent : "var(--muted)" }}
      >
        {valid && s && s.raw !== null ? fmt(s.raw, 1) : "—"}
      </span>
      {hint && (
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] mt-0.5" style={{ color: "var(--muted)" }}>
          {hint}
        </span>
      )}
    </div>
  );
};

export const MethodPanel = () => {
  const { state, dispatch } = useApp();
  const method = state.activeMethod;
  const bg = getMethodBg(method);
  const accent = getMethodAccent(method);
  const atLimit = state.features.length >= MAX_FEATURES;
  const instr = INSTRUCTIONS[method];

  return (
    <div
      className="rounded-tr-2xl rounded-b-2xl p-5 md:p-8"
      style={{ background: bg }}
    >
      {/* Instruction widget */}
      <div
        className="rounded-xl p-4 md:p-5 mb-6"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
          style={{ color: accent }}
        >
          ✦ How {METHOD_LABELS[method]} works
        </div>
        <p
          className="font-sans text-[14px] md:text-[15px] leading-[1.55] mb-3"
          style={{ color: "var(--ink-soft)" }}
        >
          {instr.summary}
        </p>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-1.5 mb-3">
          {instr.fields.map((f) => (
            <div key={f.label} className="flex gap-2 text-[13px] leading-snug">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.1em] shrink-0 pt-[3px]"
                style={{ color: accent, minWidth: 92 }}
              >
                {f.label}
              </span>
              <span style={{ color: "var(--ink-soft)" }}>{f.body}</span>
            </div>
          ))}
        </div>
        <div
          className="font-mono text-[11px] tracking-[0.04em] pt-2 border-t"
          style={{ color: "var(--ink)", borderColor: "rgba(17,17,16,0.12)" }}
        >
          {instr.formula}
        </div>
      </div>

      {/* Section heading */}
      <div className="flex items-baseline justify-between mb-3">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: accent }}
        >
          ✦ Enter features
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.1em]"
          style={{ color: "var(--muted)" }}
        >
          {state.features.length} of {MAX_FEATURES}
        </div>
      </div>

      {/* Feature rows */}
      <div className="flex flex-col gap-3">
        {state.features.map((f) => (
          <div
            key={f.id}
            className="group rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-[260px,1fr,auto,32px] gap-4 md:gap-5 items-start md:items-center"
            style={{ background: "rgba(255,255,255,0.55)" }}
          >
            {/* Feature info */}
            <div className="flex flex-col gap-2">
              <input
                className="w-full bg-transparent font-sans font-medium text-[15px] leading-snug outline-none border-0 border-b pb-1"
                placeholder="Feature title"
                maxLength={120}
                value={f.title}
                style={{ color: "var(--ink)", borderColor: "rgba(17,17,16,0.25)" }}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FEATURE_META",
                    id: f.id,
                    patch: { title: e.target.value },
                  })
                }
              />
              <input
                className="w-full bg-transparent font-sans text-[12px] leading-snug outline-none border-0 border-b pb-0.5"
                placeholder="description (optional)"
                maxLength={200}
                value={f.description}
                style={{ color: "var(--ink-soft)", borderColor: "rgba(17,17,16,0.12)" }}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FEATURE_META",
                    id: f.id,
                    patch: { description: e.target.value },
                  })
                }
              />
            </div>

            {/* Method inputs */}
            <div>
              {method === "moscow" && <MoscowCell feature={f} />}
              {method === "rice" && <RiceCell feature={f} />}
              {method === "ice" && <IceCell feature={f} />}
              {method === "ve" && <VeCell feature={f} />}
            </div>

            {/* Score */}
            <InlineScore feature={f} method={method} accent={accent} />

            {/* Delete */}
            <button
              aria-label="Delete feature"
              title="Delete feature"
              onClick={() => dispatch({ type: "REMOVE_FEATURE", id: f.id })}
              disabled={state.features.length <= 1}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity justify-self-end"
              style={{
                background: "rgba(255,255,255,0.7)",
                color: "var(--accent)",
                cursor: state.features.length <= 1 ? "not-allowed" : "pointer",
                opacity: state.features.length <= 1 ? 0 : undefined,
              }}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="mt-4">
        <button
          onClick={() => dispatch({ type: "ADD_FEATURE" })}
          disabled={atLimit}
          className="font-sans text-[14px] font-medium transition-all py-1 group/add"
          style={{
            color: atLimit ? "var(--muted)" : "var(--ink-soft)",
            cursor: atLimit ? "not-allowed" : "pointer",
            background: "transparent",
            border: "none",
          }}
          title={atLimit ? "Max 20 features reached" : "Add a feature"}
        >
          <span
            className="underline decoration-transparent group-hover/add:decoration-current transition-colors"
            style={{ textUnderlineOffset: 4 }}
          >
            + Add another feature
          </span>
          {atLimit && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] ml-3" style={{ color: accent }}>
              limit reached
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
