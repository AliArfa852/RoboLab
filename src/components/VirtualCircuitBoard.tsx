import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Cpu, 
  Zap, 
  Circle, 
  Square, 
  RotateCcw, 
  Save, 
  Download, 
  Upload,
  Play,
  Square as StopIcon,
  Settings,
  Grid3X3,
  Layers,
  Trash2,
  Copy,
  Move,
  MousePointer
} from 'lucide-react';
import { ApiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Circuit component types
interface CircuitComponent {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  properties: Record<string, any>;
  rotation: number;
  locked: boolean;
  selected: boolean;
}

interface CircuitConnection {
  id: string;
  from: { componentId: string; pin: string };
  to: { componentId: string; pin: string };
  color: string;
  width: number;
}

interface CircuitData {
  components: CircuitComponent[];
  connections: CircuitConnection[];
  metadata: {
    name: string;
    description: string;
    version: string;
    gridSize: number;
    zoom: number;
  };
}

// Component library
const COMPONENT_LIBRARY = {
  microcontrollers: [
    { type: 'arduino-uno', name: 'Arduino Uno', icon: Cpu, pins: ['VCC', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5'] },
    { type: 'esp32', name: 'ESP32', icon: Cpu, pins: ['VCC', 'GND', 'GPIO2', 'GPIO4', 'GPIO5', 'GPIO12', 'GPIO13', 'GPIO14', 'GPIO15', 'GPIO16', 'GPIO17', 'GPIO18', 'GPIO19', 'GPIO21', 'GPIO22', 'GPIO23', 'GPIO25', 'GPIO26', 'GPIO27', 'GPIO32', 'GPIO33', 'GPIO34', 'GPIO35', 'GPIO36', 'GPIO39'] },
    { type: 'raspberry-pi', name: 'Raspberry Pi', icon: Cpu, pins: ['3.3V', '5V', 'GND', 'GPIO2', 'GPIO3', 'GPIO4', 'GPIO14', 'GPIO15', 'GPIO17', 'GPIO18', 'GPIO27', 'GPIO22', 'GPIO23', 'GPIO24', 'GPIO25', 'GPIO8', 'GPIO7', 'GPIO10', 'GPIO9', 'GPIO11', 'GPIO5', 'GPIO6', 'GPIO12', 'GPIO13', 'GPIO19', 'GPIO16', 'GPIO26', 'GPIO20', 'GPIO21'] }
  ],
  sensors: [
    { type: 'dht22', name: 'DHT22', icon: Circle, pins: ['VCC', 'GND', 'DATA'] },
    { type: 'hc-sr04', name: 'HC-SR04', icon: Circle, pins: ['VCC', 'GND', 'TRIG', 'ECHO'] },
    { type: 'bmp280', name: 'BMP280', icon: Circle, pins: ['VCC', 'GND', 'SCL', 'SDA'] },
    { type: 'ldr', name: 'LDR', icon: Circle, pins: ['VCC', 'GND', 'SIG'] }
  ],
  outputs: [
    { type: 'led', name: 'LED', icon: Circle, pins: ['ANODE', 'CATHODE'] },
    { type: 'buzzer', name: 'Buzzer', icon: Circle, pins: ['POSITIVE', 'NEGATIVE'] },
    { type: 'servo', name: 'Servo Motor', icon: Circle, pins: ['VCC', 'GND', 'SIGNAL'] },
    { type: 'relay', name: 'Relay', icon: Circle, pins: ['VCC', 'GND', 'IN', 'NO', 'NC', 'COM'] }
  ],
  passive: [
    { type: 'resistor', name: 'Resistor', icon: Circle, pins: ['PIN1', 'PIN2'] },
    { type: 'capacitor', name: 'Capacitor', icon: Circle, pins: ['PIN1', 'PIN2'] },
    { type: 'diode', name: 'Diode', icon: Circle, pins: ['ANODE', 'CATHODE'] },
    { type: 'transistor', name: 'Transistor', icon: Circle, pins: ['BASE', 'COLLECTOR', 'EMITTER'] }
  ],
  power: [
    { type: 'battery', name: 'Battery', icon: Square, pins: ['POSITIVE', 'NEGATIVE'] },
    { type: 'power-supply', name: 'Power Supply', icon: Square, pins: ['VCC', 'GND'] },
    { type: 'voltage-regulator', name: 'Voltage Regulator', icon: Square, pins: ['INPUT', 'GND', 'OUTPUT'] }
  ]
};

interface VirtualCircuitBoardProps {
  projectId?: string;
  onSave?: (circuitData: CircuitData) => void;
  onLoad?: () => Promise<CircuitData | null>;
  readOnly?: boolean;
}

const VirtualCircuitBoard: React.FC<VirtualCircuitBoardProps> = ({
  projectId,
  onSave,
  onLoad,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [connections, setConnections] = useState<CircuitConnection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [circuitName, setCircuitName] = useState('Untitled Circuit');
  const { toast } = useToast();

  // Load circuit data on mount
  useEffect(() => {
    if (onLoad) {
      onLoad().then(data => {
        if (data) {
          setComponents(data.components);
          setConnections(data.connections);
          setCircuitName(data.metadata.name);
          setGridSize(data.metadata.gridSize);
          setZoom(data.metadata.zoom);
        }
      });
    }
  }, [onLoad]);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panOffset.x, panOffset.y);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width / zoom; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / zoom);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height / zoom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / zoom, y);
        ctx.stroke();
      }
    }

    // Draw connections
    connections.forEach(connection => {
      const fromComp = components.find(c => c.id === connection.from.componentId);
      const toComp = components.find(c => c.id === connection.to.componentId);
      
      if (fromComp && toComp) {
        ctx.strokeStyle = connection.color;
        ctx.lineWidth = connection.width;
        ctx.beginPath();
        ctx.moveTo(fromComp.position.x, fromComp.position.y);
        ctx.lineTo(toComp.position.x, toComp.position.y);
        ctx.stroke();
      }
    });

    // Draw components
    components.forEach(component => {
      drawComponent(ctx, component);
    });

    ctx.restore();
  }, [components, connections, gridSize, zoom, panOffset, showGrid]);

  // Draw individual component
  const drawComponent = (ctx: CanvasRenderingContext2D, component: CircuitComponent) => {
    const { position, type, selected } = component;
    
    // Component body
    ctx.fillStyle = selected ? '#3b82f6' : '#6b7280';
    ctx.fillRect(position.x - 20, position.y - 20, 40, 40);
    
    // Component border
    ctx.strokeStyle = selected ? '#1d4ed8' : '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(position.x - 20, position.y - 20, 40, 40);
    
    // Component label
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(component.name, position.x, position.y + 4);
  };

  // Handle canvas events
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x;
    const y = (e.clientY - rect.top) / zoom - panOffset.y;

    if (selectedTool === 'select') {
      // Select component
      const clickedComponent = components.find(comp => 
        Math.abs(comp.position.x - x) < 20 && Math.abs(comp.position.y - y) < 20
      );
      
      setSelectedComponent(clickedComponent || null);
      setComponents(prev => prev.map(comp => ({
        ...comp,
        selected: comp.id === clickedComponent?.id
      })));
    } else if (selectedTool.startsWith('add-')) {
      // Add new component
      const componentType = selectedTool.replace('add-', '');
      const libraryItem = Object.values(COMPONENT_LIBRARY)
        .flat()
        .find(item => item.type === componentType);
      
      if (libraryItem) {
        const newComponent: CircuitComponent = {
          id: `comp_${Date.now()}`,
          type: componentType,
          name: libraryItem.name,
          position: { x, y },
          properties: {},
          rotation: 0,
          locked: false,
          selected: false
        };
        
        setComponents(prev => [...prev, newComponent]);
        setSelectedTool('select');
      }
    }
  };

  // Handle canvas drag
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x;
    const y = (e.clientY - rect.top) / zoom - panOffset.y;

    const clickedComponent = components.find(comp => 
      Math.abs(comp.position.x - x) < 20 && Math.abs(comp.position.y - y) < 20
    );

    if (clickedComponent && selectedTool === 'select') {
      setIsDragging(true);
      setDragStart({ x, y });
      setSelectedComponent(clickedComponent);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly || !isDragging || !selectedComponent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x;
    const y = (e.clientY - rect.top) / zoom - panOffset.y;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setComponents(prev => prev.map(comp => 
      comp.id === selectedComponent.id
        ? { ...comp, position: { x: comp.position.x + deltaX, y: comp.position.y + deltaY } }
        : comp
    ));

    setDragStart({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Save circuit
  const handleSave = async () => {
    const circuitData: CircuitData = {
      components,
      connections,
      metadata: {
        name: circuitName,
        description: '',
        version: '1.0.0',
        gridSize,
        zoom
      }
    };

    if (onSave) {
      onSave(circuitData);
    }

    if (projectId) {
      try {
        await ApiService.createCircuit({
          projectId,
          name: circuitName,
          circuitJson: circuitData
        });
        toast({
          title: "Circuit Saved",
          description: "Your circuit has been saved successfully.",
        });
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Failed to save circuit. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Delete selected component
  const handleDeleteComponent = () => {
    if (selectedComponent) {
      setComponents(prev => prev.filter(comp => comp.id !== selectedComponent.id));
      setConnections(prev => prev.filter(conn => 
        conn.from.componentId !== selectedComponent.id && 
        conn.to.componentId !== selectedComponent.id
      ));
      setSelectedComponent(null);
    }
  };

  // Clear canvas
  const handleClear = () => {
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
  };

  // Redraw canvas when components change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <Input
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                className="h-8 w-48"
                placeholder="Circuit Name"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTool === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('select')}
            >
              <MousePointer className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedTool === 'wire' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool('wire')}
            >
              <Zap className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={components.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={components.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant={isSimulating ? 'destructive' : 'default'}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            disabled={components.length === 0}
          >
            {isSimulating ? <StopIcon className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isSimulating ? 'Stop' : 'Simulate'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Component Library */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Components
            </h3>
            
            {Object.entries(COMPONENT_LIBRARY).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                  {category.replace('-', ' ')}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <Button
                      key={item.type}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedTool(`add-${item.type}`)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full border border-border cursor-crosshair"
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
          
          {/* Simulation Status */}
          {isSimulating && (
            <div className="absolute top-4 right-4">
              <Card className="bg-green-500/90 text-white">
                <CardContent className="p-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Simulation Running</span>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Component Properties */}
          {selectedComponent && (
            <div className="absolute top-4 left-4 w-64">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Component Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={selectedComponent.name}
                      onChange={(e) => {
                        setComponents(prev => prev.map(comp => 
                          comp.id === selectedComponent.id 
                            ? { ...comp, name: e.target.value }
                            : comp
                        ));
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Position</Label>
                    <div className="flex space-x-1">
                      <Input
                        value={selectedComponent.position.x}
                        onChange={(e) => {
                          setComponents(prev => prev.map(comp => 
                            comp.id === selectedComponent.id 
                              ? { ...comp, position: { ...comp.position, x: parseInt(e.target.value) || 0 } }
                              : comp
                          ));
                        }}
                        className="h-8 text-xs"
                        placeholder="X"
                      />
                      <Input
                        value={selectedComponent.position.y}
                        onChange={(e) => {
                          setComponents(prev => prev.map(comp => 
                            comp.id === selectedComponent.id 
                              ? { ...comp, position: { ...comp.position, y: parseInt(e.target.value) || 0 } }
                              : comp
                          ));
                        }}
                        className="h-8 text-xs"
                        placeholder="Y"
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteComponent}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Component
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-64 border-l bg-card">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Properties</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Grid Size</Label>
                <Input
                  type="number"
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value) || 20)}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-sm">Zoom</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value) || 1)}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-sm">Components</Label>
                <Badge variant="secondary">{components.length}</Badge>
              </div>
              
              <div>
                <Label className="text-sm">Connections</Label>
                <Badge variant="secondary">{connections.length}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCircuitBoard;
