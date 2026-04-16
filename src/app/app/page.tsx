"use client";

import { useEffect, useRef } from "react";
import { AppProvider } from "../../context/AppContext";
import { Tabs } from "../../components/Tabs";
import { MethodPanel } from "../../components/MethodPanel";
import { Results } from "../../components/Results";
import { ExportBar } from "../../components/ExportBar";

const BeforeUnloadGuard = () => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  return null;
};

const HomeInner = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <BeforeUnloadGuard />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Hero */}
        <section className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-baseline gap-4 justify-between">
            <div
              className="font-display italic font-semibold text-[22px] tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Consensus<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <div
              className="font-mono text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--accent)" }}
            >
              ● Live · MVP · Free while in validation
            </div>
          </div>
        </section>

        {/* Tabs + active method panel */}
        <section className="mb-14">
          <Tabs />
          <MethodPanel />
        </section>

        {/* Overall consensus */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 justify-between mb-6">
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1"
                style={{ color: "var(--accent)" }}
              >
                ✦ Multi-method consensus
              </div>
              <h2
                className="font-display font-light leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                The <em style={{ fontStyle: "italic", color: "var(--accent)" }}>consensus</em> across all 4 methods.
              </h2>
              <p className="font-sans text-[14px] mt-2 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
                Each method is normalized to 0–100 and averaged. Top of the list = agreement across methods.
              </p>
            </div>
          </div>

          <Results ref={resultsRef} />
        </section>

        <footer
          className="pt-6 flex flex-wrap justify-between items-end gap-6 font-mono text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          <div
            className="font-display italic font-semibold text-[22px]"
            style={{ color: "var(--ink)" }}
          >
            Consensus<span style={{ color: "var(--accent)" }}>.</span>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ color: "var(--accent)" }}>MVP EDITION</span>
            <span>No signup · No save · Free while in validation</span>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ color: "var(--accent)" }}>TYPOGRAPHY</span>
            <span>Fraunces · IBM Plex Sans · JetBrains Mono</span>
          </div>
        </footer>
      </main>

      <ExportBar targetRef={resultsRef} />
    </>
  );
};

export default function Page() {
  return (
    <AppProvider>
      <HomeInner />
    </AppProvider>
  );
}
