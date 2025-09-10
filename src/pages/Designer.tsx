import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { 
  Cpu, 
  Save, 
  Download, 
  Upload, 
  Play, 
  Square, 
  Circle, 
  Zap,
  RotateCcw,
  Grid3X3,
  Layers,
  Settings,
  Timer as TimerIcon
} from "lucide-react";
import { useDesigner } from "@/hooks/useDesigner";
import { defaultComponentPalette } from "@/lib/sim/registry";

const Designer = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const { graph, start, stop, isRunning, addComponent, importGraph, exportGraph } = useDesigner();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tools = [
    { id: "select", name: "Select", icon: Square },
    { id: "wire", name: "Wire", icon: Zap },
    { id: "resistor", name: "Resistor", icon: Circle },
    { id: "led", name: "LED", icon: Circle },
    { id: "arduino", name: "Arduino", icon: Cpu },
  ];

  const palette = defaultComponentPalette;
  const typeToIcon: Record<string, any> = {
    vcc5: Zap,
    button: Square,
    led: Circle,
    timer: TimerIcon,
  };

  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importGraph(text);
    e.target.value = "";
  };

  const handleExport = () => {
    const json = exportGraph();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "circuit.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Circuit Designer</h1>
                  <p className="text-sm text-muted-foreground">Untitled Circuit</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input ref={fileInputRef} onChange={handleImportFile} type="file" accept="application/json" className="hidden" />
                <Button variant="outline" size="sm" onClick={handleImportClick}>
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button 
                  variant={isRunning ? "destructive" : "circuit"}
                  size="sm"
                  onClick={() => (isRunning ? stop() : start())}
                >
                  {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Stop" : "Simulate"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Tools Sidebar */}
          <div className="w-16 border-r border-border bg-card">
            <div className="p-2 space-y-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  size="icon"
                  className="w-12 h-12"
                  onClick={() => setSelectedTool(tool.id)}
                  title={tool.name}
                >
                  <tool.icon className="w-5 h-5" />
                </Button>
              ))}
              <div className="border-t border-border pt-2 mt-4">
                <Button variant="ghost" size="icon" className="w-12 h-12" title="Undo">
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-12 h-12" title="Settings">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Components Panel */}
          <div className="w-64 border-r border-border bg-card">
            <div className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Components
              </h3>
              <div className="space-y-2">
                {palette.map((component, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors border-border"
                    onClick={() => addComponent(component.type)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                          {(() => {
                            const Icon = typeToIcon[component.type] ?? Layers;
                            return <Icon className="w-4 h-4 text-primary" />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{component.name}</div>
                          <div className="text-xs text-muted-foreground">{component.type}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative">
            {/* Circuit Canvas */}
            <div className="absolute inset-0 bg-circuit-bg bg-circuit-pattern">
              <div className="w-full h-full flex items-center justify-center">
                <Card className="bg-card/90 backdrop-blur-sm border-2 border-dashed border-border">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center mx-auto mb-6">
                      <Cpu className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Start Designing Your Circuit</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Drag components from the sidebar to start building your circuit. 
                      Connect them with wires and simulate your design.
                    </p>
                    <div className="space-y-3">
                      <Button variant="circuit" className="w-full">
                        Add Arduino Uno
                      </Button>
                      <Button variant="outline" className="w-full">
                        Import Existing Design
                      </Button>
                      <Button variant="ghost" className="w-full">
                        View Tutorials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Simulation Status */}
            {isRunning && (
              <div className="absolute top-4 right-4">
                <Card className="bg-circuit-trace/90 backdrop-blur-sm border-circuit-trace">
                  <CardContent className="p-3 flex items-center space-x-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Simulation Running</span>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Grid Controls */}
            <div className="absolute bottom-4 left-4">
              <Card className="bg-card/90 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Grid: ON</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">Zoom: 100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 border-l border-border bg-card">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Properties</h3>
              <div className="space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Circuit Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Components:</span>
                      <span>{graph.components.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections:</span>
                      <span>{graph.connections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jumpers:</span>
                      <span>{graph.jumpers?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Power:</span>
                      <span className="text-accent">5V</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent("vcc5") }>
                      <Cpu className="w-4 h-4" />
                      Add +5V Source
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent("led") }>
                      <Circle className="w-4 h-4" />
                      Add LED
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addComponent("timer") }>
                      <TimerIcon className="w-4 h-4" />
                      Add Timer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designer;