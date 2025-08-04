import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  Lightbulb, 
  Clock, 
  DollarSign, 
  Users, 
  Filter, 
  Home, 
  Car, 
  Shield, 
  Thermometer,
  Camera,
  Gamepad2,
  Smartphone,
  Heart
} from "lucide-react";

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  estimatedTime: string;
  estimatedCost: number;
  components: string[];
  features: string[];
  icon: any;
}

const Ideas = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const projectIdeas: ProjectIdea[] = [
    {
      id: "1",
      title: "Smart Home Temperature Monitor",
      description: "Monitor temperature and humidity in multiple rooms with real-time alerts and data logging.",
      difficulty: "Beginner",
      category: "Home Automation",
      estimatedTime: "2-3 hours",
      estimatedCost: 35,
      components: ["ESP32", "DHT22", "OLED Display", "Breadboard"],
      features: ["WiFi connectivity", "Mobile app", "Data logging", "Email alerts"],
      icon: Thermometer
    },
    {
      id: "2",
      title: "Smart Security Camera",
      description: "AI-powered security camera with motion detection and smartphone notifications.",
      difficulty: "Advanced",
      category: "Security",
      estimatedTime: "1-2 days",
      estimatedCost: 120,
      components: ["Raspberry Pi", "Camera module", "PIR sensor", "SD card"],
      features: ["Motion detection", "Live streaming", "Face recognition", "Cloud storage"],
      icon: Camera
    },
    {
      id: "3",
      title: "Arduino Game Console",
      description: "Retro gaming console with multiple classic games and custom controllers.",
      difficulty: "Intermediate",
      category: "Entertainment",
      estimatedTime: "1 week",
      estimatedCost: 85,
      components: ["Arduino Mega", "TFT Display", "Buttons", "Speaker"],
      features: ["Multiple games", "High scores", "Custom controllers", "Sound effects"],
      icon: Gamepad2
    },
    {
      id: "4",
      title: "Smart Plant Watering System",
      description: "Automated plant care system with soil moisture monitoring and scheduled watering.",
      difficulty: "Intermediate",
      category: "Home Automation",
      estimatedTime: "4-6 hours",
      estimatedCost: 45,
      components: ["Arduino Uno", "Soil sensor", "Water pump", "Relay module"],
      features: ["Automatic watering", "Moisture monitoring", "Schedule control", "Low water alerts"],
      icon: Heart
    },
    {
      id: "5",
      title: "Bluetooth Car Control",
      description: "Remote controlled car with smartphone app and obstacle avoidance.",
      difficulty: "Intermediate",
      category: "Robotics",
      estimatedTime: "2-3 days",
      estimatedCost: 75,
      components: ["Arduino Uno", "HC-05 Bluetooth", "Motors", "Ultrasonic sensor"],
      features: ["App control", "Obstacle avoidance", "Speed control", "LED indicators"],
      icon: Car
    },
    {
      id: "6",
      title: "IoT Weather Station",
      description: "Complete weather monitoring station with web dashboard and API.",
      difficulty: "Advanced",
      category: "IoT",
      estimatedTime: "1 week",
      estimatedCost: 95,
      components: ["ESP32", "Multiple sensors", "Solar panel", "Battery"],
      features: ["Weather prediction", "Web dashboard", "API access", "Solar powered"],
      icon: Smartphone
    }
  ];

  const categories = ["all", "Home Automation", "Security", "Entertainment", "Robotics", "IoT"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredIdeas = projectIdeas.filter(idea => {
    const matchesDifficulty = selectedDifficulty === "all" || idea.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;
    return matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-4 shadow-glow">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Project Ideas</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing project ideas with detailed guides, component lists, and difficulty ratings.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Difficulty:</span>
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-primary/10 ${
                      selectedDifficulty === difficulty ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-primary/10 ${
                      selectedCategory === category ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <idea.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className={getDifficultyColor(idea.difficulty)}>
                      {idea.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {idea.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {idea.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{idea.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">${idea.estimatedCost}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">1 person</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Components:</h4>
                    <div className="flex flex-wrap gap-1">
                      {idea.components.slice(0, 3).map((component, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                      {idea.components.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{idea.components.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {idea.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {idea.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="circuit" className="flex-1">
                      View Guide
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Get Parts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your difficulty or category filters.
              </p>
            </div>
          )}

          {/* Popular Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(1).map((category) => {
                const categoryCount = projectIdeas.filter(idea => idea.category === category).length;
                const CategoryIcon = {
                  "Home Automation": Home,
                  "Security": Shield,
                  "Entertainment": Gamepad2,
                  "Robotics": Car,
                  "IoT": Smartphone
                }[category] || Lightbulb;

                return (
                  <Card
                    key={category}
                    className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CategoryIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryCount} project{categoryCount !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ideas;