import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CircuitGraph, ComponentInstance, Jumper, SimulationSnapshot } from "@/lib/sim/types";
import { buildDefaultRegistry } from "@/lib/sim/registry";
import { createEngine } from "@/lib/sim/engine";

export interface UseDesigner {
  graph: CircuitGraph;
  addComponent: (type: string, position?: { x: number; y: number }) => void;
  addConnection: (from: { componentId: string; portId: string }, to: { componentId: string; portId: string }) => void;
  addJumper: (ends: { componentId: string; portId: string }[]) => void;
  removeJumper: (jumperId: string) => void;
  clear: () => void;
  start: () => void;
  stop: () => void;
  isRunning: boolean;
  snapshot: SimulationSnapshot | null;
  importGraph: (json: string) => void;
  exportGraph: () => string;
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useDesigner(): UseDesigner {
  const [graph, setGraph] = useState<CircuitGraph>({ components: [], connections: [], jumpers: [] });
  const [snapshot, setSnapshot] = useState<SimulationSnapshot | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const registry = useMemo(() => buildDefaultRegistry(), []);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);

  const getGraph = useCallback(() => graph, [graph]);

  useEffect(() => {
    engineRef.current = createEngine(getGraph, registry, setSnapshot);
    return () => {
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, [getGraph, registry]);

  const addComponent = useCallback((type: string, position?: { x: number; y: number }) => {
    const name = type;
    const id = generateId(type);
    const instance: ComponentInstance = {
      id,
      type,
      name,
      position: position ?? { x: 0, y: 0 },
      config: {},
    };
    setGraph((g) => ({ ...g, components: [...g.components, instance] }));
  }, []);

  const addConnection = useCallback((from: { componentId: string; portId: string }, to: { componentId: string; portId: string }) => {
    const id = generateId("wire");
    setGraph((g) => ({ ...g, connections: [...g.connections, { id, from, to }] }));
  }, []);

  const addJumper = useCallback((ends: { componentId: string; portId: string }[]) => {
    const id = generateId("jumper");
    const jumper: Jumper = { id, ends };
    setGraph((g) => ({ ...g, jumpers: [...(g.jumpers ?? []), jumper] }));
  }, []);

  const removeJumper = useCallback((jumperId: string) => {
    setGraph((g) => ({ ...g, jumpers: (g.jumpers ?? []).filter((j) => j.id !== jumperId) }));
  }, []);

  const clear = useCallback(() => {
    setGraph({ components: [], connections: [], jumpers: [] });
    setSnapshot(null);
  }, []);

  const start = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.start();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsRunning(false);
  }, []);

  const importGraph = useCallback((json: string) => {
    try {
      const obj = JSON.parse(json) as CircuitGraph;
      if (!obj || !Array.isArray(obj.components) || !Array.isArray(obj.connections)) return;
      setGraph(obj);
    } catch {}
  }, []);

  const exportGraph = useCallback(() => {
    return JSON.stringify(graph, null, 2);
  }, [graph]);

  return {
    graph,
    addComponent,
    addConnection,
    addJumper,
    removeJumper,
    clear,
    start,
    stop,
    isRunning,
    snapshot,
    importGraph,
    exportGraph,
  };
}


