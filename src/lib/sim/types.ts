export type PortDirection = "in" | "out" | "bidirectional";

export type LogicValue = 0 | 1 | "Z" | "X";

export interface PortSpec {
  id: string;
  name: string;
  direction: PortDirection;
}

export interface ComponentSpec {
  type: string;
  displayName: string;
  ports: PortSpec[];
  // Optional default config
  defaults?: Record<string, unknown>;
  // Optional visual pin layout for UI rendering
  pinLayout?: Array<{
    id: string;
    x: number;
    y: number;
    side?: "left" | "right" | "top" | "bottom";
  }>;
}

export interface ComponentInstance {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  // User-configurable parameters for the component
  config: Record<string, unknown>;
  // Internal state for simulation
  state?: Record<string, unknown>;
}

export interface Connection {
  id: string;
  from: { componentId: string; portId: string };
  to: { componentId: string; portId: string };
}

export interface JumperEnd {
  componentId: string;
  portId: string;
}

export interface Jumper {
  id: string; // unique jumper cable id
  ends: JumperEnd[]; // typically 2, but can be >2 for bus-like behavior
}

export interface CircuitGraph {
  components: ComponentInstance[];
  connections: Connection[];
  jumpers?: Jumper[];
}

export interface PortSignal {
  componentId: string;
  portId: string;
  value: LogicValue;
}

export interface ComponentRuntime {
  spec: ComponentSpec;
  // Called once on add or when simulation starts
  initialize?(instance: ComponentInstance): ComponentInstance;
  // Called each simulation tick; returns updated instance state and output signals
  tick(
    instance: ComponentInstance,
    readPort: (portId: string) => LogicValue
  ): { instance: ComponentInstance; outputs: Record<string, LogicValue> };
}

export interface SimulationSnapshot {
  tick: number;
  signals: Record<string, LogicValue>; // key: `${componentId}:${portId}`
}

export interface SimulationEngine {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  step: () => void;
  getSnapshot: () => SimulationSnapshot;
  onUpdate: (callback: (snapshot: SimulationSnapshot) => void) => () => void;
}


