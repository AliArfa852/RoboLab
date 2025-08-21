import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import ProjectForm, { ProjectFormData } from "@/components/ProjectForm";
import { 
  FolderOpen, 
  Clock, 
  Users, 
  Star, 
  Plus, 
  Search,
  Filter,
  Grid,
  List,
  Play,
  Code,
  Zap,
  Edit,
  Settings,
  Lock,
  Globe
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "In Progress" | "Completed" | "Planned" | "Draft";
  category: string;
  lastModified: string;
  components: string[];
  thumbnail: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isPublic?: boolean;
  estimatedCost?: number;
  currency?: string;
  tags?: string[];
  toolStack?: string[];
}

const Projects = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Smart Home Controller",
      description: "ESP32-based home automation system with temperature, humidity, and lighting control.",
      status: "In Progress",
      category: "Home Automation",
      lastModified: "2 hours ago",
      components: ["ESP32", "DHT22", "Relay Module", "OLED Display"],
      thumbnail: "/placeholder.svg",
      difficulty: "Intermediate",
      isPublic: true,
      estimatedCost: 45,
      currency: "USD",
      tags: ["IoT", "Home Automation", "ESP32"],
      toolStack: ["Arduino IDE", "ESP32"]
    },
    {
      id: "2",
      title: "Arduino LED Matrix Clock",
      description: "Digital clock display using 8x8 LED matrix with time, date, and temperature.",
      status: "Completed",
      category: "Display",
      lastModified: "1 day ago",
      components: ["Arduino Uno", "LED Matrix", "RTC Module", "DHT11"],
      thumbnail: "/placeholder.svg",
      difficulty: "Beginner",
      isPublic: false,
      estimatedCost: 25,
      currency: "USD",
      tags: ["Arduino", "LED", "Clock"],
      toolStack: ["Arduino IDE"]
    },
    {
      id: "3",
      title: "IoT Security Camera",
      description: "Raspberry Pi camera system with motion detection and mobile notifications.",
      status: "Planned",
      category: "Security",
      lastModified: "3 days ago",
      components: ["Raspberry Pi", "Camera Module", "PIR Sensor"],
      thumbnail: "/placeholder.svg",
      difficulty: "Advanced",
      isPublic: false,
      estimatedCost: 75,
      currency: "USD",
      tags: ["Raspberry Pi", "Security", "IoT"],
      toolStack: ["Python", "OpenCV"]
    }
  ]);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.status === filter);

  const handleCreateProject = (data: ProjectFormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: data.name,
      description: data.description,
      status: data.status,
      category: data.tags[0] || "General",
      lastModified: "Just now",
      components: data.components.map(c => c.name),
      thumbnail: "/placeholder.svg",
      difficulty: data.difficultyLevel,
      isPublic: data.isPublic,
      estimatedCost: data.estimatedCost,
      currency: data.currency,
      tags: data.tags,
      toolStack: data.toolStack
    };
    setProjects([newProject, ...projects]);
  };

  const handleEditProject = (data: ProjectFormData) => {
    if (editingProject) {
      const updatedProject: Project = {
        ...editingProject,
        title: data.name,
        description: data.description,
        status: data.status,
        category: data.tags[0] || editingProject.category,
        lastModified: "Just now",
        components: data.components.map(c => c.name),
        difficulty: data.difficultyLevel,
        isPublic: data.isPublic,
        estimatedCost: data.estimatedCost,
        currency: data.currency,
        tags: data.tags,
        toolStack: data.toolStack
      };
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      setEditingProject(null);
    }
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Planned": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Projects</h1>
              <p className="text-muted-foreground">
                Manage and track your hardware projects
              </p>
            </div>
            <Button 
              variant="hero" 
              className="animate-pulse-glow"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              
              <div className="flex border border-input rounded-md">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Projects */}
          {view === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <FolderOpen className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          {project.isPublic ? (
                            <Globe className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">
                            {project.category}
                          </Badge>
                          {project.estimatedCost && (
                            <Badge variant="secondary">
                              {project.currency} {project.estimatedCost}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(project);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {project.lastModified}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.components.slice(0, 2).map((component, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {component}
                          </Badge>
                        ))}
                        {project.components.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.components.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="circuit" className="flex-1">
                        <Play className="w-4 h-4" />
                        Open
                      </Button>
                      <Button variant="outline" size="icon">
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                          <FolderOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            {project.isPublic ? (
                              <Globe className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge variant="outline">{project.category}</Badge>
                            {project.estimatedCost && (
                              <Badge variant="secondary">
                                {project.currency} {project.estimatedCost}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Modified {project.lastModified}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="circuit" size="sm">
                          <Play className="w-4 h-4" />
                          Open
                        </Button>
                        <Button variant="outline" size="sm">
                          <Code className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(project);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Create your first project to get started with RoboLabPK.
              </p>
              <Button variant="hero" onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>

      <ProjectForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingProject(null);
          }
        }}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
        initialData={editingProject ? {
          name: editingProject.title,
          description: editingProject.description,
          tags: editingProject.tags || [],
          toolStack: editingProject.toolStack || [],
          components: editingProject.components.map(name => ({
            name,
            quantity: 1,
            category: "Misc",
            datasheet: ""
          })),
          estimatedCost: editingProject.estimatedCost || 0,
          currency: editingProject.currency || "USD",
          difficultyLevel: editingProject.difficulty,
          estimatedTime: "Unknown",
          status: editingProject.status as any,
          isPublic: editingProject.isPublic || false
        } : undefined}
        mode={editingProject ? "edit" : "create"}
      />
    </div>
  );
};

export default Projects;