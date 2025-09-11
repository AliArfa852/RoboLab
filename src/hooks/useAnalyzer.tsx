import { useCallback, useMemo, useState } from "react";
import { CircuitGraph, SimulationSnapshot } from "@/lib/sim/types";
import { Diagnostic } from "@/lib/sim/diagnostics/types";
import { runAnalyzers } from "@/lib/sim/diagnostics/rules";
import { createLlmAnalyzer, LlmAnalyzerOptions } from "@/lib/sim/diagnostics/llmAdapter";

export function useAnalyzer(graph: CircuitGraph, snapshot: SimulationSnapshot | null, options?: LlmAnalyzerOptions) {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiAnalyzer = useMemo(() => createLlmAnalyzer(options), [options]);

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ctx = { graph, snapshot };
      const ruleDiags = runAnalyzers(ctx);
      const aiDiags = await aiAnalyzer(ctx);
      setDiagnostics([...ruleDiags, ...aiDiags]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to analyze");
    } finally {
      setLoading(false);
    }
  }, [graph, snapshot, aiAnalyzer]);

  return { diagnostics, loading, error, analyze };
}



