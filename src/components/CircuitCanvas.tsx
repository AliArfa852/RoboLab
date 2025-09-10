import React, { useCallback, useMemo, useState } from "react";
import { CircuitGraph, ComponentInstance } from "@/lib/sim/types";
import { buildDefaultRegistry } from "@/lib/sim/registry";

export interface CircuitCanvasProps {
  graph: CircuitGraph;
  onAddJumper: (ends: { componentId: string; portId: string }[]) => void;
  width?: number;
  height?: number;
}

interface PinPosition {
  componentId: string;
  portId: string;
  x: number;
  y: number;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ graph, onAddJumper, width = 800, height = 500 }) => {
  const registry = useMemo(() => buildDefaultRegistry(), []);
  const [pendingEnd, setPendingEnd] = useState<PinPosition | null>(null);

  const computePinPositions = useCallback((): PinPosition[] => {
    const pins: PinPosition[] = [];
    for (const comp of graph.components) {
      const runtime = registry[comp.type];
      const layout = runtime?.spec.pinLayout ?? [];
      const baseX = comp.position?.x ?? 0;
      const baseY = comp.position?.y ?? 0;
      const w = 120;
      const h = 60;
      for (const pin of layout) {
        pins.push({
          componentId: comp.id,
          portId: pin.id,
          x: baseX + pin.x * w,
          y: baseY + pin.y * h,
        });
      }
    }
    return pins;
  }, [graph.components, registry]);

  const pins = computePinPositions();

  const handlePinClick = (pin: PinPosition) => {
    if (!pendingEnd) {
      setPendingEnd(pin);
    } else {
      if (pendingEnd.componentId === pin.componentId && pendingEnd.portId === pin.portId) {
        setPendingEnd(null);
        return;
      }
      onAddJumper([
        { componentId: pendingEnd.componentId, portId: pendingEnd.portId },
        { componentId: pin.componentId, portId: pin.portId },
      ]);
      setPendingEnd(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Render components as simple rectangles */}
      {graph.components.map((comp) => {
        const x = comp.position?.x ?? 0;
        const y = comp.position?.y ?? 0;
        return (
          <div key={comp.id} className="absolute border border-border rounded bg-card/80" style={{ left: x, top: y, width: 120, height: 60 }}>
            <div className="text-xs p-2 truncate">{comp.name}</div>
          </div>
        );
      })}

      {/* Render pins */}
      {pins.map((pin) => (
        <button
          key={`${pin.componentId}:${pin.portId}`}
          className={`absolute w-3 h-3 rounded-full border border-primary ${pendingEnd && pendingEnd.componentId === pin.componentId && pendingEnd.portId === pin.portId ? "bg-primary" : "bg-background"}`}
          style={{ left: pin.x - 6, top: pin.y - 6 }}
          title={`${pin.componentId}:${pin.portId}`}
          onClick={() => handlePinClick(pin)}
        />
      ))}

      {/* Render existing jumpers as simple lines (approximate) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {graph.jumpers?.map((jumper) => {
          if (jumper.ends.length < 2) return null;
          const lines = [] as JSX.Element[];
          const ends = jumper.ends
            .map((e) => pins.find((p) => p.componentId === e.componentId && p.portId === e.portId))
            .filter(Boolean) as PinPosition[];
          for (let i = 1; i < ends.length; i++) {
            const a = ends[0];
            const b = ends[i];
            lines.push(
              <line key={`${jumper.id}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--primary)" strokeWidth={2} />
            );
          }
          return <g key={jumper.id}>{lines}</g>;
        })}
      </svg>
    </div>
  );
};

export default CircuitCanvas;


