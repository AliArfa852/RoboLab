import { Analyzer, AnalyzerContext, Diagnostic } from "./types";

function unreachableComponents(ctx: AnalyzerContext): Diagnostic[] {
  const { graph } = ctx;
  const used = new Set<string>();
  for (const c of graph.connections) {
    used.add(c.from.componentId);
    used.add(c.to.componentId);
  }
  const diags: Diagnostic[] = [];
  for (const comp of graph.components) {
    if (!used.has(comp.id)) {
      diags.push({
        id: `unused:${comp.id}`,
        code: "UNUSED_COMPONENT",
        severity: "info",
        message: `${comp.name} is not connected to anything`,
        componentId: comp.id,
        help: "Connect this component to others or remove it.",
      });
    }
  }
  return diags;
}

function floatingInputs(ctx: AnalyzerContext): Diagnostic[] {
  const { graph } = ctx;
  // Ports are not typed in graph; we can infer by connection endpoints: any destination without any source
  const inputs = new Map<string, number>(); // key `${componentId}:${portId}` => incoming count
  for (const conn of graph.connections) {
    const key = `${conn.to.componentId}:${conn.to.portId}`;
    inputs.set(key, (inputs.get(key) ?? 0) + 1);
  }
  // Include jumper fan-in counts: any jumper end is treated as an input that could be driven by any of the other ends
  if (graph.jumpers) {
    for (const jumper of graph.jumpers) {
      for (const end of jumper.ends) {
        const key = `${end.componentId}:${end.portId}`;
        inputs.set(key, (inputs.get(key) ?? 0) + (jumper.ends.length - 1));
      }
    }
  }
  const seenDest = new Set(inputs.keys());
  const diags: Diagnostic[] = [];
  // We cannot list all possible input ports without registry; focus on destinations that have zero (none exist by definition), so nothing.
  // Instead, detect multiple drivers on same destination (fan-in > 1)
  for (const [key, count] of inputs) {
    if (count > 1) {
      const [componentId, portId] = key.split(":");
      diags.push({
        id: `multidrive:${key}`,
        code: "MULTIPLE_DRIVERS",
        severity: "error",
        message: `Port ${portId} has ${count} drivers`,
        componentId,
        portId,
        help: "Ensure only one source drives an input port.",
      });
    }
  }
  // Warn if no connections at all
  if (graph.connections.length === 0 && graph.components.length > 0) {
    diags.push({
      id: "no-connections",
      code: "NO_CONNECTIONS",
      severity: "warning",
      message: "Your circuit has components but no connections",
      help: "Use the Wire tool to connect outputs to inputs.",
    });
  }
  return diags;
}

function runtimeStuck(ctx: AnalyzerContext): Diagnostic[] {
  const { snapshot } = ctx;
  if (!snapshot) return [];
  // Simple heuristic: if no signals at all
  if (Object.keys(snapshot.signals).length === 0 && snapshot.tick > 5) {
    return [{
      id: "no-signals",
      code: "NO_ACTIVITY",
      severity: "info",
      message: "Simulation is running but there are no signals yet",
      help: "Add a source (Timer or +5V) and connect it to a component.",
    }];
  }
  return [];
}

export const ruleAnalyzers: Analyzer[] = [
  unreachableComponents,
  floatingInputs,
  runtimeStuck,
];

export const runAnalyzers: Analyzer = (ctx: AnalyzerContext) => {
  return ruleAnalyzers.flatMap((a) => a(ctx));
};


