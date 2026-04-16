"use client";

import { RefObject, useState } from "react";
import { exportNodeAsPdf, exportNodeAsPng } from "../lib/export";
import { useApp } from "../context/AppContext";
import { Feature } from "../lib/types";

interface Props {
  targetRef: RefObject<HTMLDivElement | null>;
}

const hasAnyScore = (f: Feature) =>
  f.moscow !== null ||
  f.rice.reach !== null ||
  f.rice.impact !== null ||
  f.rice.confidence !== null ||
  f.rice.effort !== null ||
  f.ice.impact !== null ||
  f.ice.confidence !== null ||
  f.ice.ease !== null ||
  f.ve.value !== null ||
  f.ve.effort !== null;

export const ExportBar = ({ targetRef }: Props) => {
  const { state } = useApp();
  const hasData = state.features.some(hasAnyScore);
  const [busy, setBusy] = useState<null | "pdf" | "png">(null);

  if (!hasData) return null;

  const handle = async (kind: "pdf" | "png") => {
    if (!targetRef.current) return;
    setBusy(kind);
    try {
      const ts = new Date().toISOString().slice(0, 10);
      if (kind === "png") await exportNodeAsPng(targetRef.current, `consensus-${ts}.png`);
      else await exportNodeAsPdf(targetRef.current, `consensus-${ts}.pdf`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="sticky bottom-0 z-10 border-t"
      style={{ borderColor: "var(--ink)", background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            ● Ready to export
          </div>
          <div className="font-display text-[18px] leading-tight">
            Export your ranking as PDF or PNG.
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-ghost"
            disabled={busy !== null}
            onClick={() => handle("png")}
          >
            {busy === "png" ? "Rendering…" : "↓ PNG"}
          </button>
          <button
            className="btn btn-accent"
            disabled={busy !== null}
            onClick={() => handle("pdf")}
          >
            {busy === "pdf" ? "Rendering…" : "↓ Export PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};
