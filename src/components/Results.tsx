"use client";

import { forwardRef } from "react";
import { useApp } from "../context/AppContext";
import { computeConsensus } from "../lib/calculations";
import { METHOD_LABELS, MOSCOW_LABELS } from "../lib/types";

const fmt = (n: number | null, digits = 1) =>
  n === null ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: digits });

const ValueEffortMatrix = ({ features }: { features: ReturnType<typeof computeConsensus> }) => {
  const items = features
    .map((row) => ({
      id: row.feature.id,
      title: row.feature.title || "Untitled",
      value: row.feature.ve.value,
      effort: row.feature.ve.effort,
    }))
    .filter((i) => typeof i.value === "number" && typeof i.effort === "number");

  if (items.length === 0) {
    return (
      <div
        className="font-mono text-[11px] uppercase tracking-[0.12em] p-6 text-center"
        style={{ color: "var(--muted)", background: "var(--paper-warm)", border: "1px dashed var(--rule)" }}
      >
        Fill in Value/Effort scores to see the 2×2 matrix.
      </div>
    );
  }

  const quadrants: Array<{
    title: string;
    sub: string;
    x: number;
    y: number;
    accent: boolean;
  }> = [
    { title: "Quick Wins", sub: "High value · Low effort", x: 0, y: 0, accent: true },
    { title: "Big Bets", sub: "High value · High effort", x: 1, y: 0, accent: false },
    { title: "Fill-ins", sub: "Low value · Low effort", x: 0, y: 1, accent: false },
    { title: "Time Wasters", sub: "Low value · High effort", x: 1, y: 1, accent: false },
  ];

  return (
    <div
      className="relative border p-8 pl-16 pb-16"
      style={{ borderColor: "var(--rule)", background: "var(--paper)", aspectRatio: "1.3 / 1" }}
    >
      {/* Y label */}
      <div
        className="absolute left-4 top-8 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ color: "var(--muted)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Value →
      </div>
      {/* X label */}
      <div
        className="absolute bottom-4 left-16 right-8 font-mono text-[10px] uppercase tracking-[0.12em] text-right"
        style={{ color: "var(--muted)" }}
      >
        Effort →
      </div>

      <div className="relative w-full h-full grid grid-cols-2 grid-rows-2" style={{ outline: "1px solid var(--rule)" }}>
        {quadrants.map((q) => (
          <div
            key={q.title}
            className="relative border p-3"
            style={{
              borderColor: "var(--rule)",
              background: q.accent ? "rgba(216,58,20,0.06)" : "transparent",
            }}
          >
            <div className="font-display text-[16px] font-medium leading-none">{q.title}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] mt-1" style={{ color: "var(--muted)" }}>
              {q.sub}
            </div>
          </div>
        ))}

        {items.map((it) => {
          // effort: 1-10 → x 0-1
          // value: 1-10 → y 1-0 (invert, top = high value)
          const left = ((it.effort! - 1) / 9) * 100;
          const top = ((10 - it.value!) / 9) * 100;
          return (
            <div
              key={it.id}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 0 2px var(--paper)" }}
              />
              <div
                className="font-mono text-[10px] absolute left-4 top-[-2px] whitespace-nowrap px-1"
                style={{ background: "var(--paper)", color: "var(--ink)" }}
              >
                {it.title.length > 24 ? it.title.slice(0, 22) + "…" : it.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BarChart = ({ rows }: { rows: ReturnType<typeof computeConsensus> }) => {
  const valid = rows.filter((r) => r.consensus !== null);
  if (valid.length === 0) {
    return (
      <div
        className="font-mono text-[11px] uppercase tracking-[0.12em] p-6 text-center"
        style={{ color: "var(--muted)", background: "var(--paper-warm)", border: "1px dashed var(--rule)" }}
      >
        Scores pending — fill all selected method fields.
      </div>
    );
  }
  const max = Math.max(...valid.map((r) => r.consensus ?? 0), 100);
  return (
    <div className="flex flex-col gap-2 p-6 border" style={{ borderColor: "var(--rule)", background: "var(--paper)" }}>
      {valid.map((r, i) => {
        const pct = ((r.consensus ?? 0) / max) * 100;
        return (
          <div key={r.feature.id} className="grid grid-cols-[30px,1fr,60px] items-center gap-3">
            <div
              className="font-display italic font-light text-[20px] leading-none"
              style={{ color: i === 0 ? "var(--accent)" : "var(--muted)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="relative">
              <div
                className="h-6"
                style={{
                  width: `${pct}%`,
                  background: i === 0 ? "var(--accent)" : "var(--ink)",
                  transition: "width 0.5s ease",
                }}
              />
              <div
                className="absolute left-2 top-0 bottom-0 flex items-center font-sans font-medium text-[13px]"
                style={{ color: i === 0 || pct > 25 ? "var(--paper)" : "var(--ink)" }}
              >
                {r.feature.title || "Untitled"}
              </div>
            </div>
            <div
              className="font-mono font-semibold text-[14px] text-right"
              style={{ color: i === 0 ? "var(--accent)" : "var(--ink)" }}
            >
              {fmt(r.consensus)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MoscowColumns = ({ rows }: { rows: ReturnType<typeof computeConsensus> }) => {
  const cats = ["must", "should", "could", "wont"] as const;
  const grouped = cats.map((c) => ({
    c,
    items: rows.filter((r) => r.feature.moscow === c),
  }));

  return (
    <div className="grid md:grid-cols-4 gap-3">
      {grouped.map((g) => (
        <div
          key={g.c}
          className="border p-3 min-h-[80px]"
          style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--accent)" }}>
            {MOSCOW_LABELS[g.c]} ({g.items.length})
          </div>
          <ul className="flex flex-col gap-1">
            {g.items.map((r) => (
              <li
                key={r.feature.id}
                className="text-[12px] leading-snug border px-2 py-1"
                style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}
              >
                {r.feature.title || "Untitled"}
              </li>
            ))}
            {g.items.length === 0 && (
              <li className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>
                —
              </li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export const Results = forwardRef<HTMLDivElement>((_props, ref) => {
  const { state } = useApp();
  const rows = computeConsensus(state.features, state.methods);
  const methods = state.methods;

  return (
    <div
      ref={ref}
      className="border p-6 md:p-8"
      style={{
        borderColor: "var(--rule)",
        background: "var(--paper-warm)",
        boxShadow: "-8px 8px 0 var(--ink)",
      }}
    >
      <div className="flex flex-wrap items-baseline gap-4 justify-between mb-4 pb-3 border-b" style={{ borderColor: "rgba(17,17,16,0.2)" }}>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            Live ranking
          </div>
          <h3 className="font-display text-[24px] leading-tight">
            {state.features.length} feature{state.features.length !== 1 ? "s" : ""} · {methods.length} method
            {methods.length !== 1 ? "s" : ""}
            {methods.length > 1 ? " · consensus active" : ""}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <span
              key={m}
              className="font-mono text-[10px] uppercase tracking-[0.12em] px-2 py-1 border"
              style={{ borderColor: "var(--ink)", background: "var(--ink)", color: "var(--paper)" }}
            >
              {METHOD_LABELS[m]}
            </span>
          ))}
        </div>
      </div>

      {methods.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
          Pick methods to see a live ranking here.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Feature</th>
                  {methods.map((m) => (
                    <th key={m} className="text-right">
                      {METHOD_LABELS[m]}
                    </th>
                  ))}
                  <th className="text-right">Consensus</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const top = i === 0 && r.consensus !== null;
                  return (
                    <tr key={r.feature.id}>
                      <td
                        className="font-display italic font-light text-[18px]"
                        style={{ color: top ? "var(--accent)" : "var(--muted)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="font-sans font-medium" style={{ fontSize: 14 }}>
                        {r.feature.title || <span style={{ color: "var(--muted)" }}>(untitled)</span>}
                        {r.feature.description && (
                          <div
                            className="font-sans"
                            style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400, marginTop: 2 }}
                          >
                            {r.feature.description}
                          </div>
                        )}
                      </td>
                      {methods.map((m) => {
                        const s = r.perMethod[m];
                        return (
                          <td key={m} className="text-right align-middle" style={{ color: "var(--ink-soft)" }}>
                            {s && s.normalized !== null ? (
                              <span className="font-semibold">{fmt(s.normalized, 0)}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                        );
                      })}
                      <td
                        className="text-right font-display font-medium"
                        style={{ fontSize: 18, color: top ? "var(--accent)" : "var(--ink)" }}
                      >
                        {fmt(r.consensus, 1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--muted)" }}>
                Consensus bar chart
              </div>
              <BarChart rows={rows} />
            </div>

            {methods.includes("ve") && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--muted)" }}>
                  Value vs Effort matrix
                </div>
                <ValueEffortMatrix features={rows} />
              </div>
            )}

            {methods.includes("moscow") && !methods.includes("ve") && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--muted)" }}>
                  MoSCoW buckets
                </div>
                <MoscowColumns rows={rows} />
              </div>
            )}
          </div>

          {methods.includes("moscow") && methods.includes("ve") && (
            <div className="mt-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--muted)" }}>
                MoSCoW buckets
              </div>
              <MoscowColumns rows={rows} />
            </div>
          )}
        </>
      )}
    </div>
  );
});

Results.displayName = "Results";
