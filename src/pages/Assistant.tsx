import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { Bot, Send, Sparkles, Code, Cpu, Lightbulb, Zap } from "lucide-react";

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
      content: "Hi! I'm your TinkerLab AI assistant. I can help you with circuit design, component selection, coding Arduino/ESP32, debugging issues, and generating project ideas. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");

  const quickPrompts = [
    { icon: Cpu, text: "Help me design a temperature monitoring system", category: "Circuits" },
    { icon: Code, text: "Debug my Arduino code for LED matrix", category: "Coding" },
    { icon: Lightbulb, text: "Suggest a home automation project", category: "Ideas" },
    { icon: Zap, text: "Calculate power consumption for my project", category: "Analysis" }
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `That's a great question about "${input}". I'd be happy to help! Let me provide you with a detailed solution...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

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

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Quick Prompts Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-primary/10"
                      onClick={() => handleQuickPrompt(prompt.text)}
                    >
                      <div className="flex items-start space-x-3">
                        <prompt.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{prompt.category}</div>
                          <div className="text-xs text-muted-foreground">{prompt.text}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-card border-border h-[600px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.type === 'assistant' && (
                            <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about circuits, components, coding, or project ideas..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      variant="circuit"
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">What I Can Help With</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Cpu className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Circuit Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Help with schematics, component selection, and circuit optimization.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Code className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Code Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Debug Arduino, ESP32, Raspberry Pi code and suggest improvements.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Project Ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate creative project ideas based on your interests and skill level.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Troubleshooting</h3>
                  <p className="text-sm text-muted-foreground">
                    Diagnose issues and provide step-by-step solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;