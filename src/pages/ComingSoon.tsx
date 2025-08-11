import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Cpu, ShoppingCart, Lightbulb, Wrench, Bot, Github, Mail, Bell } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-lab.jpg";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const features = [
    {
      icon: Zap,
      title: "Circuit Designer",
      description: "Advanced drag-and-drop circuit design tool",
      progress: 35,
      status: "In Development",
      color: "bg-primary"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Smart AI helper for robotics and IoT projects",
      progress: 20,
      status: "Planning",
      color: "bg-secondary"
    },
    {
      icon: ShoppingCart,
      title: "Hardware Store",
      description: "Pakistani component marketplace with local suppliers",
      progress: 60,
      status: "In Development",
      color: "bg-accent"
    },
    {
      icon: Lightbulb,
      title: "Project Ideas",
      description: "Curated robotics and IoT project tutorials",
      progress: 45,
      status: "In Development",
      color: "bg-primary-glow"
    },
    {
      icon: Wrench,
      title: "User Projects",
      description: "Save, share and collaborate on your designs",
      progress: 25,
      status: "Planning",
      color: "bg-circuit-component"
    },
    {
      icon: Cpu,
      title: "Code Generation",
      description: "Auto-generate Arduino/Raspberry Pi code",
      progress: 10,
      status: "Research",
      color: "bg-circuit-via"
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thanks for your interest!",
        description: "We'll notify you when these features are ready.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="text-primary border-primary/30">
                <Bell className="w-4 h-4 mr-2" />
                Features Under Development
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Amazing Features
                  <br />
                  Coming Soon
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We're building the future of hardware innovation. Get early access to revolutionary 
                  tools that will transform how you design, build, and share robotics projects.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary-glow">
                  <Mail className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </form>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-glow rounded-full" />
              <img
                src={heroImage}
                alt="RoboLabPK Development"
                className="relative rounded-2xl shadow-elevated w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We're Building
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each feature is being carefully crafted to provide the best hardware innovation experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-lg ${feature.color}/10`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color.replace('bg-', '')}`} />
                    </div>
                    <Badge 
                      variant={feature.status === "In Development" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{feature.progress}%</span>
                    </div>
                    <Progress 
                      value={feature.progress} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Development Roadmap
            </h2>
            <p className="text-xl text-muted-foreground">
              Our planned timeline for feature releases
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  phase: "Phase 1",
                  title: "Core Platform (4-6 weeks)",
                  features: ["User Authentication", "Basic Circuit Designer", "Component Database"],
                  status: "current"
                },
                {
                  phase: "Phase 2", 
                  title: "AI Integration (2-3 weeks)",
                  features: ["AI Assistant", "Smart Recommendations", "Code Generation"],
                  status: "upcoming"
                },
                {
                  phase: "Phase 3",
                  title: "Advanced Features (2-3 weeks)", 
                  features: ["Real-time Collaboration", "Advanced Simulation", "Mobile App"],
                  status: "future"
                }
              ].map((phase, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className={`w-4 h-4 rounded-full mt-2 ${
                    phase.status === 'current' ? 'bg-primary' : 
                    phase.status === 'upcoming' ? 'bg-secondary' : 'bg-muted'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={phase.status === 'current' ? 'default' : 'secondary'}>
                        {phase.phase}
                      </Badge>
                      <h3 className="text-xl font-semibold">{phase.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-card rounded-full text-sm text-muted-foreground">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Want to Contribute?
            </h2>
            <p className="text-xl text-muted-foreground">
              RoboLabPK is open source! Help us build the future of hardware innovation.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-glow">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
              <Button size="lg" variant="outline">
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore Current Features
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;