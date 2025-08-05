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
      
      <div className="pt-12 sm:pt-16 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-glow">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Hardware Store</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Find the perfect components for your projects. Real prices, detailed specs, and fast shipping.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-auto"
                />
              </div>
              <div className="flex gap-2 sm:gap-4">
                <Button variant="outline" className="flex items-center gap-2 flex-1 sm:flex-none h-10 sm:h-auto">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
                <Button variant="circuit" className="flex items-center gap-2 flex-1 sm:flex-none h-10 sm:h-auto">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span> ({cartItems.length})
                </Button>
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-manipulation">
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg leading-tight">{component.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {component.category}
                      </Badge>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        Rs.{component.price}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        <span>{component.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
                        className="flex-1 h-10 sm:h-auto text-sm touch-manipulation"
                      >
                        {isInCart(component.id) ? (
                          <span className="sm:hidden">Remove</span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                          </>
                        )}
                        <span className="hidden sm:inline">
                          {isInCart(component.id) ? " from Cart" : ""}
                        </span>
                      </Button>
                    ) : (
                      <Button disabled className="flex-1 h-10 sm:h-auto text-sm">
                        <span className="sm:hidden">Out of Stock</span>
                        <span className="hidden sm:inline">Out of Stock</span>
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-10 w-10 sm:h-auto sm:w-auto touch-manipulation">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground text-sm sm:text-base px-4">
                Try adjusting your search terms or category filters.
              </p>
            </div>
          )}

          {/* Popular Categories */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {categories.slice(1).map((category) => (
                <Card
                  key={category}
                  className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 cursor-pointer touch-manipulation"
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Package className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{category}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
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