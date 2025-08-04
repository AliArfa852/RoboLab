import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-circuit-pattern">
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      
      <Card className="relative bg-gradient-card border-border shadow-elevated max-w-md w-full mx-4 animate-slide-up">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-6 shadow-glow animate-pulse-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4">Circuit Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Looks like this component got disconnected from the main circuit. 
            Let's get you back to the TinkerLab.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4" />
              Return Home
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-6 text-xs text-muted-foreground">
            Route: {location.pathname}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
