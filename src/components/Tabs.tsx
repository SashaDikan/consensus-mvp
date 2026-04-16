"use client";

import { useApp } from "../context/AppContext";
import { MethodId, METHOD_LABELS } from "../lib/types";

const ORDER: MethodId[] = ["moscow", "rice", "ice", "ve"];

const METHOD_BG: Record<MethodId, string> = {
  moscow: "#ffe9c4",
  rice: "#d4e8dd",
  ice: "#cde3f0",
  ve: "#e1d9ff",
};

const METHOD_ACCENT: Record<MethodId, string> = {
  moscow: "#a07a1c",
  rice: "#2d5d3a",
  ice: "#2a5d8d",
  ve: "#5a3fd4",
};

export const Tabs = () => {
  const { state, dispatch } = useApp();

  return (
    <div
      className="flex flex-wrap gap-0"
      role="tablist"
      aria-label="Prioritization method"
    >
      {ORDER.map((m) => {
        const active = state.activeMethod === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => dispatch({ type: "SET_ACTIVE_METHOD", method: m })}
            className="font-display font-medium text-[22px] md:text-[28px] px-5 md:px-8 py-4 md:py-5 transition-all tracking-tight"
            style={{
              background: active ? METHOD_BG[m] : "transparent",
              color: active ? METHOD_ACCENT[m] : "var(--muted)",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              position: "relative",
              marginRight: 4,
              bottom: active ? -1 : 0,
              zIndex: active ? 2 : 1,
              boxShadow: active ? "0 -4px 0 rgba(0,0,0,0.04)" : "none",
              cursor: active ? "default" : "pointer",
            }}
          >
            <span style={{ fontStyle: active ? "italic" : "normal" }}>
              {METHOD_LABELS[m]}
            </span>
            {active && (
              <span
                className="font-mono text-[10px] tracking-[0.12em] uppercase ml-3 align-middle"
                style={{ color: METHOD_ACCENT[m], opacity: 0.55 }}
              >
                ● editing
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const getMethodBg = (m: MethodId) => METHOD_BG[m];
export const getMethodAccent = (m: MethodId) => METHOD_ACCENT[m];
