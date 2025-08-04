import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FeatureCard from "@/components/FeatureCard";
import { Bot, ShoppingCart, Lightbulb, Cpu, Zap, ArrowRight, Sparkles, Code, Wrench } from "lucide-react";
import heroImage from "@/assets/hero-lab.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Hardware Innovation Platform</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Build the Future with{" "}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    TinkerLab
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From circuit design to AI assistance, TinkerLab is your complete ecosystem for hardware innovation. 
                  Design, learn, build, and shop - all in one place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl">
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="xl">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <span>Real Components</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Open Source</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-3xl opacity-20 animate-pulse-glow"></div>
              <img 
                src={heroImage} 
                alt="TinkerLab Hardware Innovation Platform" 
                className="relative rounded-2xl shadow-elevated w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Innovate</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              TinkerLab combines powerful tools with an intuitive interface to help you bring your hardware ideas to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Cpu}
              title="Circuit Designer"
              description="Design and simulate circuits with our intuitive drag-and-drop interface."
              buttonText="Start Designing"
              buttonVariant="circuit"
            />
            
            <FeatureCard
              icon={Bot}
              title="AI Assistant"
              description="Get instant help with coding, debugging, and project guidance from our AI."
              buttonText="Ask AI"
              buttonVariant="component"
            />
            
            <FeatureCard
              icon={ShoppingCart}
              title="Hardware Store"
              description="Browse components, create parts lists, and find the best prices."
              buttonText="Shop Now"
              buttonVariant="accent"
            />
            
            <FeatureCard
              icon={Lightbulb}
              title="Project Ideas"
              description="Discover curated project ideas with difficulty levels and guides."
              buttonText="Get Inspired"
              buttonVariant="default"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Components Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Project Ideas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">10k+</div>
              <div className="text-muted-foreground">Makers Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of makers and engineers who are already using TinkerLab to bring their ideas to life.
          </p>
          <Button variant="secondary" size="xl" className="shadow-elevated">
            Get Started for Free
            <Zap className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TinkerLab</span>
              </div>
              <p className="text-muted-foreground">
                Empowering the next generation of hardware innovators.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Circuit Designer</li>
                <li>AI Assistant</li>
                <li>Hardware Store</li>
                <li>Project Ideas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>Community</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TinkerLab. Building the future of hardware innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
