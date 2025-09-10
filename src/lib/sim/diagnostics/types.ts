import { CircuitGraph, SimulationSnapshot } from "@/lib/sim/types";

export type DiagnosticSeverity = "error" | "warning" | "info";

export interface Diagnostic {
  id: string;
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  componentId?: string;
  portId?: string;
  help?: string;
}

export interface AnalyzerContext {
  graph: CircuitGraph;
  snapshot: SimulationSnapshot | null;
}

export type Analyzer = (ctx: AnalyzerContext) => Diagnostic[];


