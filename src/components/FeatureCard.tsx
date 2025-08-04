import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "circuit" | "component" | "accent";
  className?: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = "default",
  className = ""
}: FeatureCardProps) => {
  return (
    <Card className={`bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-glow rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;