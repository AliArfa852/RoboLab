import { Analyzer, AnalyzerContext, Diagnostic } from "./types";

export interface LlmAnalyzerOptions {
  agentUrl?: string; // e.g. https://agent.yourdomain.com/analyze
  apiKey?: string; // optional
  model?: string; // optional hint for backend
}

export function createLlmAnalyzer(options?: LlmAnalyzerOptions): Analyzer {
  const agentUrl = options?.agentUrl || (import.meta as any)?.env?.VITE_AGENT_API_URL || "";
  const apiKey = options?.apiKey || (import.meta as any)?.env?.VITE_AGENT_API_KEY || "";
  const model = options?.model || (import.meta as any)?.env?.VITE_AGENT_MODEL || "";

  return async (ctx: AnalyzerContext): Promise<Diagnostic[]> => {
    if (!agentUrl) return [];
    try {
      const res = await fetch(agentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          graph: ctx.graph,
          snapshot: ctx.snapshot,
          // Allow backend to know schema version if needed
          schema: {
            version: 1,
          },
        }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const items: Diagnostic[] = Array.isArray(data?.diagnostics)
        ? data.diagnostics.map((d: any, idx: number) => ({
            id: String(d.id ?? `ai-${idx}`),
            code: String(d.code ?? "AI_DIAG"),
            severity: (d.severity === "error" || d.severity === "warning" || d.severity === "info") ? d.severity : "info",
            message: String(d.message ?? ""),
            componentId: d.componentId ? String(d.componentId) : undefined,
            portId: d.portId ? String(d.portId) : undefined,
            help: d.help ? String(d.help) : undefined,
          }))
        : [];
      return items;
    } catch {
      return [];
    }
  };
}



