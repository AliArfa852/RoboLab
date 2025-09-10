import { ComponentInstance, ComponentRuntime, ComponentSpec, LogicValue } from "./types";

export type ComponentRegistry = Record<string, ComponentRuntime>;

const vcc5Spec: ComponentSpec = {
  type: "vcc5",
  displayName: "+5V Source",
  ports: [
    { id: "Vout", name: "Vout", direction: "out" },
  ],
  pinLayout: [
    { id: "Vout", x: 1, y: 0.5, side: "right" },
  ],
};

const buttonSpec: ComponentSpec = {
  type: "button",
  displayName: "Button",
  ports: [
    { id: "out", name: "Out", direction: "out" },
  ],
  defaults: { pressed: false },
  pinLayout: [
    { id: "out", x: 1, y: 0.5, side: "right" },
  ],
};

const ledSpec: ComponentSpec = {
  type: "led",
  displayName: "LED",
  ports: [
    { id: "anode", name: "Anode", direction: "in" },
  ],
  defaults: { color: "red" },
  pinLayout: [
    { id: "anode", x: 0, y: 0.5, side: "left" },
  ],
};

const timerSpec: ComponentSpec = {
  type: "timer",
  displayName: "Timer",
  ports: [
    { id: "out", name: "Out", direction: "out" },
  ],
  defaults: { period: 10 },
  pinLayout: [
    { id: "out", x: 1, y: 0.5, side: "right" },
  ],
};

function createVcc5Runtime(): ComponentRuntime {
  return {
    spec: vcc5Spec,
    tick(instance) {
      return { instance, outputs: { Vout: 1 } };
    },
  };
}

function createButtonRuntime(): ComponentRuntime {
  return {
    spec: buttonSpec,
    initialize(instance) {
      const pressed = Boolean(instance.config?.pressed ?? false);
      return { ...instance, config: { ...instance.config, pressed } };
    },
    tick(instance) {
      const pressed = Boolean(instance.config?.pressed ?? false);
      return { instance, outputs: { out: pressed ? 1 : 0 } };
    },
  };
}

function createLedRuntime(): ComponentRuntime {
  return {
    spec: ledSpec,
    tick(instance, readPort) {
      const anode = readPort("anode");
      const on = anode === 1;
      const updated: ComponentInstance = {
        ...instance,
        state: { ...instance.state, on },
      };
      // LED has no outputs
      return { instance: updated, outputs: {} };
    },
  };
}

function createTimerRuntime(): ComponentRuntime {
  return {
    spec: timerSpec,
    initialize(instance) {
      const period = Number(instance.config?.period ?? timerSpec.defaults?.period ?? 10);
      return { ...instance, state: { ...instance.state, counter: 0, value: 0, period } };
    },
    tick(instance) {
      const period = Number(instance.state?.period ?? instance.config?.period ?? 10);
      let counter = Number(instance.state?.counter ?? 0) + 1;
      let value: LogicValue = Number(instance.state?.value ?? 0) as LogicValue;
      if (counter >= Math.max(1, period)) {
        counter = 0;
        value = (value === 1 ? 0 : 1) as LogicValue;
      }
      const updated: ComponentInstance = {
        ...instance,
        state: { ...instance.state, counter, value, period },
      };
      return { instance: updated, outputs: { out: value } };
    },
  };
}

export function buildDefaultRegistry(): ComponentRegistry {
  return {
    [vcc5Spec.type]: createVcc5Runtime(),
    [buttonSpec.type]: createButtonRuntime(),
    [ledSpec.type]: createLedRuntime(),
    [timerSpec.type]: createTimerRuntime(),
  };
}

export const defaultComponentPalette: Array<{ type: string; name: string }> = [
  { type: "vcc5", name: "+5V Source" },
  { type: "button", name: "Button" },
  { type: "led", name: "LED" },
  { type: "timer", name: "Timer" },
];


