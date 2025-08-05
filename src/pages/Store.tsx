import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Search, ShoppingCart, Filter, Star, Plus, Package } from "lucide-react";

interface Component {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
  specs: string[];
}

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Mock component data
  const components: Component[] = [
    {
      id: "1",
      name: "Arduino Uno R3",
      category: "Microcontrollers",
      price: 2199,
      rating: 4.8,
      image: "/placeholder.svg",
      description: "Original Arduino Uno R3 with USB cable. Perfect for beginners.",
      inStock: true,
      specs: ["ATmega328P", "14 Digital I/O", "6 Analog inputs", "USB connection"]
    },
    {
      id: "2",
      name: "ESP32 DevKit",
      category: "Microcontrollers",
      price: 1099,
      rating: 4.7,
      image: "/placeholder.svg",
      description: "WiFi + Bluetooth enabled microcontroller for IoT projects.",
      inStock: true,
      specs: ["WiFi 802.11", "Bluetooth 4.2", "240MHz CPU", "520KB SRAM"]
    },
    {
      id: "3",
      name: "DHT22 Temperature Sensor",
      category: "Sensors",
      price: 799,
      rating: 4.5,
      image: "/placeholder.svg",
      description: "High accuracy temperature and humidity sensor.",
      inStock: true,
      specs: ["±0.5°C accuracy", "0-100% humidity", "3.3-6V supply", "Digital output"]
    },
    {
      id: "4",
      name: "HC-SR04 Ultrasonic Sensor",
      category: "Sensors",
      price: 349,
      rating: 4.6,
      image: "/placeholder.svg",
      description: "Non-contact distance measurement sensor.",
      inStock: false,
      specs: ["2cm-400cm range", "15° measuring angle", "5V supply", "Trigger/Echo pins"]
    },
    {
      id: "5",
      name: "Breadboard 830 Points",
      category: "Prototyping",
      price: 449,
      rating: 4.4,
      image: "/placeholder.svg",
      description: "Half-size breadboard for circuit prototyping.",
      inStock: true,
      specs: ["830 tie points", "65mm x 45mm", "ABS plastic", "Metal contacts"]
    },
    {
      id: "6",
      name: "LED Kit (200pcs)",
      category: "Components",
      price: 1399,
      rating: 4.3,
      image: "/placeholder.svg",
      description: "Assorted LED kit with multiple colors and sizes.",
      inStock: true,
      specs: ["5 colors", "3mm & 5mm", "200 pieces", "Storage box included"]
    }
  ];

  const categories = ["all", "Microcontrollers", "Sensors", "Components", "Prototyping"];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (componentId: string) => {
    setCartItems(prev => [...prev, componentId]);
  };

  const removeFromCart = (componentId: string) => {
    setCartItems(prev => prev.filter(id => id !== componentId));
  };

  const isInCart = (componentId: string) => cartItems.includes(componentId);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-4 shadow-glow">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Hardware Store</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect components for your projects. Real prices, detailed specs, and fast shipping.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components, sensors, microcontrollers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="circuit" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartItems.length})
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
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

          {/* Components Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {component.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        Rs.{component.price}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        <span>{component.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Specs:</h4>
                    <div className="flex flex-wrap gap-1">
                      {component.specs.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {component.inStock ? (
                      <Button
                        onClick={() => isInCart(component.id) ? removeFromCart(component.id) : addToCart(component.id)}
                        variant={isInCart(component.id) ? "secondary" : "circuit"}
                        className="flex-1"
                      >
                        {isInCart(component.id) ? (
                          "Remove from Cart"
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="flex-1">
                        Out of Stock
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filters.
              </p>
            </div>
          )}

          {/* Popular Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Popular Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(1).map((category) => (
                <Card
                  key={category}
                  className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {components.filter(c => c.category === category).length} items
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;