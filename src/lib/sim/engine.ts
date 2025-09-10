import { CircuitGraph, ComponentInstance, ComponentRuntime, LogicValue, SimulationEngine, SimulationSnapshot } from "./types";

function keyFor(componentId: string, portId: string): string {
  return `${componentId}:${portId}`;
}

export function createEngine(
  graph: () => CircuitGraph,
  registry: Record<string, ComponentRuntime>,
  onSnapshot?: (s: SimulationSnapshot) => void
): SimulationEngine {
  let running = false;
  let tickCounter = 0;
  let intervalId: number | undefined;
  let signals: Record<string, LogicValue> = {};
  const listeners = new Set<(s: SimulationSnapshot) => void>();

  function emit() {
    const snapshot: SimulationSnapshot = { tick: tickCounter, signals: { ...signals } };
    if (onSnapshot) onSnapshot(snapshot);
    listeners.forEach((cb) => cb(snapshot));
  }

  function initializeAll(instances: ComponentInstance[]): ComponentInstance[] {
    return instances.map((instance) => {
      const runtime = registry[instance.type];
      if (runtime?.initialize) {
        return runtime.initialize(instance);
      }
      return instance;
    });
  }

  function readPortFactory(localSignals: Record<string, LogicValue>, componentId: string) {
    return (portId: string): LogicValue => {
      const k = keyFor(componentId, portId);
      return localSignals[k] ?? 0;
    };
  }

  function propagateConnections(localSignals: Record<string, LogicValue>) {
    const g = graph();
    for (const connection of g.connections) {
      const sourceKey = keyFor(connection.from.componentId, connection.from.portId);
      const destKey = keyFor(connection.to.componentId, connection.to.portId);
      const value = localSignals[sourceKey];
      if (value !== undefined) {
        localSignals[destKey] = value;
      }
    }
    return localSignals;
  }

  function propagateJumpers(localSignals: Record<string, LogicValue>) {
    const g = graph();
    if (!g.jumpers || g.jumpers.length === 0) return localSignals;
    for (const jumper of g.jumpers) {
      const driven: LogicValue[] = [];
      for (const end of jumper.ends) {
        const val = localSignals[keyFor(end.componentId, end.portId)];
        if (val !== undefined) driven.push(val);
      }
      if (driven.length === 0) continue;
      const hasOne = driven.includes(1);
      const hasZero = driven.includes(0);
      const resolved: LogicValue = hasOne && hasZero ? "X" : (hasOne ? 1 : (hasZero ? 0 : driven[0]));
      for (const end of jumper.ends) {
        localSignals[keyFor(end.componentId, end.portId)] = resolved;
      }
    }
    return localSignals;
  }

  function stepOnce() {
    const g = graph();
    const instances = initializeAll(g.components);
    const nextSignals: Record<string, LogicValue> = { ...signals };
    const updatedInstances: ComponentInstance[] = [];

    for (const instance of instances) {
      const runtime = registry[instance.type];
      if (!runtime) continue;
      const readPort = readPortFactory(signals, instance.id);
      const { instance: updated, outputs } = runtime.tick(instance, readPort);
      updatedInstances.push(updated);
      for (const [portId, value] of Object.entries(outputs)) {
        nextSignals[keyFor(instance.id, portId)] = value as LogicValue;
      }
    }

    propagateConnections(nextSignals);
    propagateJumpers(nextSignals);
    signals = nextSignals;
    tickCounter += 1;
    emit();
  }

  function start() {
    if (running) return;
    running = true;
    tickCounter = 0;
    signals = {};
    emit();
    // 30 FPS default tick
    intervalId = setInterval(stepOnce, 1000 / 30) as unknown as number;
  }

  function stop() {
    if (!running) return;
    running = false;
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function step() {
    stepOnce();
  }

  function getSnapshot(): SimulationSnapshot {
    return { tick: tickCounter, signals: { ...signals } };
  }

  function onUpdate(callback: (snapshot: SimulationSnapshot) => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  return {
    isRunning: running,
    start,
    stop,
    step,
    getSnapshot,
    onUpdate,
  };
}


