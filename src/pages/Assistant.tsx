import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ApiService, AIUsage } from "@/lib/api";
import Navigation from "@/components/Navigation";
import { Bot, Send, Sparkles, Code, Cpu, Lightbulb, Zap, Loader2 } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your RoboLabPK AI assistant. I can help you with circuit design, component selection, coding Arduino/ESP32, debugging issues, and generating project ideas. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [aiQuota, setAiQuota] = useState<AIUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const quickPrompts = [
    { icon: Cpu, text: "Help me design a temperature monitoring system", category: "Circuits" },
    { icon: Code, text: "Debug my Arduino code for LED matrix", category: "Coding" },
    { icon: Lightbulb, text: "Suggest a home automation project", category: "Ideas" },
    { icon: Zap, text: "Calculate power consumption for my project", category: "Analysis" }
  ];

  // Check AI quota on component mount
  useEffect(() => {
    if (user) {
      checkAiQuota();
    }
  }, [user]);

  const checkAiQuota = async () => {
    if (!user) return;
    
    try {
      const response = await ApiService.getAIUsage();
      
      if (response.success && response.data) {
        setAiQuota(response.data);
      } else {
        throw new Error(response.error || 'Failed to get AI usage');
      }
    } catch (error) {
      console.error('Error checking AI quota:', error);
      setError('Failed to load AI usage information');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI Assistant",
        variant: "destructive"
      });
      return;
    }

    if (aiQuota && aiQuota.remainingPrompts <= 0) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily limit of AI prompts. Try again tomorrow!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: input,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const currentInput = input;
      setInput("");
      setHasUserSentMessage(true);
      
      // Send message to AI
      const response = await ApiService.chatWithAI(currentInput);
      
      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Update AI usage
        if (response.data.usage) {
          setAiQuota(response.data.usage);
        }
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || "Failed to send message");
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const capabilities = [
    { icon: Cpu, title: "Circuit Design", description: "Help with schematics, component selection, and circuit optimization." },
    { icon: Code, title: "Code Review", description: "Debug Arduino, ESP32, Raspberry Pi code and suggest improvements." },
    { icon: Lightbulb, title: "Project Ideas", description: "Generate creative project ideas based on your interests and skill level." },
    { icon: Zap, title: "Troubleshooting", description: "Diagnose issues and provide step-by-step solutions." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-4 shadow-glow">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant help with circuits, coding, and project planning from our specialized hardware AI.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Quick Prompts Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-2 sm:p-3 hover:bg-primary/10 min-h-0"
                      onClick={() => handleQuickPrompt(prompt.text)}
                    >
                      <div className="flex items-start space-x-2 w-full">
                        <prompt.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="text-xs font-medium break-words">{prompt.category}</div>
                          <div className="text-xs text-muted-foreground break-words leading-tight whitespace-normal">{prompt.text}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="bg-gradient-card border-border h-[500px] sm:h-[600px] flex flex-col">
                {/* Error State */}
                {error && (
                  <div className="p-3 sm:p-4 border-b border-border bg-destructive/10">
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Usage Bar */}
                {user && aiQuota && (
                  <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Daily AI Usage (Beta)
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {aiQuota.promptsUsed}/{aiQuota.promptsUsed + aiQuota.remainingPrompts} prompts
                      </span>
                    </div>
                    <Progress 
                      value={(aiQuota.promptsUsed / (aiQuota.promptsUsed + aiQuota.remainingPrompts)) * 100} 
                      className="h-2"
                    />
                    <div className="mt-1 text-xs text-muted-foreground">
                      {aiQuota.remainingPrompts > 0 
                        ? `${aiQuota.remainingPrompts} prompts remaining today`
                        : "Daily limit reached. Resets tomorrow!"
                      }
                    </div>
                  </div>
                )}
                
                {/* Messages */}
                <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          {message.type === 'assistant' && (
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm break-words overflow-wrap-anywhere">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Capabilities Section - Show until user sends first message */}
                  {!hasUserSentMessage && (
                    <div className="mt-6 sm:mt-8">
                      <div className="text-center mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">What I Can Help With</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {capabilities.map((capability, index) => (
                          <Card key={index} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                            <CardContent className="p-3 sm:p-4 text-center">
                              <capability.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
                              <h4 className="font-semibold mb-1 text-xs sm:text-sm">{capability.title}</h4>
                              <p className="text-xs text-muted-foreground leading-tight">
                                {capability.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-3 sm:p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about circuits, components, coding..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim() || (user && aiQuota && aiQuota.remainingPrompts <= 0)}
                      variant="circuit"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;