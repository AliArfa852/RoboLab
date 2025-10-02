import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import VirtualCircuitBoard from "@/components/VirtualCircuitBoard";
import { ApiService, CircuitData } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  Loader2
} from "lucide-react";

const Designer = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [circuitName, setCircuitName] = useState("Untitled Circuit");
  const [circuitDescription, setCircuitDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Create new project
  const createNewProject = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create projects.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.createProject({
        title: circuitName,
        description: circuitDescription,
        isPublic: false,
        tags: ['circuit', 'design']
      });

      if (response.success && response.data) {
        setProjectId(response.data.id);
        toast({
          title: "Project Created",
          description: "New project created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save circuit data
  const handleSaveCircuit = async (circuitData: CircuitData) => {
    if (!projectId) {
      await createNewProject();
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.createCircuit({
        projectId,
        name: circuitData.metadata.name,
        circuitJson: circuitData
      });

      if (response.success) {
        toast({
          title: "Circuit Saved",
          description: "Your circuit has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save circuit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Load circuit data
  const handleLoadCircuit = async (): Promise<CircuitData | null> => {
    if (!projectId) return null;

    try {
      // This would load from the project's circuits
      // For now, return null to start fresh
      return null;
    } catch (error) {
      console.error('Error loading circuit:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Project Setup Modal */}
      {!projectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Circuit Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="circuit-name">Circuit Name</Label>
                <Input
                  id="circuit-name"
                  value={circuitName}
                  onChange={(e) => setCircuitName(e.target.value)}
                  placeholder="Enter circuit name"
                />
              </div>
              <div>
                <Label htmlFor="circuit-description">Description (Optional)</Label>
                <Textarea
                  id="circuit-description"
                  value={circuitDescription}
                  onChange={(e) => setCircuitDescription(e.target.value)}
                  placeholder="Enter circuit description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={createNewProject}
                  disabled={loading || !circuitName.trim()}
                  className="flex-1"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setProjectId('temp')}
                  className="flex-1"
                >
                  Start Without Saving
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Virtual Circuit Board */}
      <div className="pt-16">
        <VirtualCircuitBoard
          projectId={projectId || undefined}
          onSave={handleSaveCircuit}
          onLoad={handleLoadCircuit}
          readOnly={!user}
        />
      </div>

      {/* Save Status */}
      {saving && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="bg-blue-500/90 text-white">
            <CardContent className="p-3 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Saving circuit...</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Designer;