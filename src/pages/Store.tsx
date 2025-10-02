import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import { Search, ShoppingCart, Filter, Star, Plus, Package, Loader2 } from "lucide-react";
import { ApiService, Component } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load components and categories on mount
  useEffect(() => {
    loadComponents();
    loadCategories();
  }, []);

  // Load components when search or category changes
  useEffect(() => {
    loadComponents();
  }, [searchTerm, selectedCategory]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (searchTerm) {
        params.query = searchTerm;
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      const response = await ApiService.getComponents(params);
      
      if (response.success && response.data) {
        setComponents(response.data);
      } else {
        throw new Error(response.error || 'Failed to load components');
      }
    } catch (err) {
      console.error('Error loading components:', err);
      setError(err instanceof Error ? err.message : 'Failed to load components');
      toast({
        title: "Error",
        description: "Failed to load components. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      
      if (response.success && response.data) {
        setCategories(["all", ...response.data]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const addToCart = (componentId: string) => {
    setCartItems(prev => [...prev, componentId]);
    toast({
      title: "Added to Cart",
      description: "Component added to your cart successfully.",
    });
  };

  const removeFromCart = (componentId: string) => {
    setCartItems(prev => prev.filter(id => id !== componentId));
    toast({
      title: "Removed from Cart",
      description: "Component removed from your cart.",
    });
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

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading components...</span>
            </div>
          )}

          {/* Components Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {components.map((component) => (
                <Card key={component._id} className="bg-gradient-card border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-manipulation">
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
                          {component.currency} {component.price}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{component.rating.toFixed(1)}</span>
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
                        {Object.entries(component.specifications).slice(0, 3).map(([key, value], index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {component.inStock ? (
                        <Button
                          onClick={() => isInCart(component._id) ? removeFromCart(component._id) : addToCart(component._id)}
                          variant={isInCart(component._id) ? "secondary" : "circuit"}
                          className="flex-1 h-10 sm:h-auto text-sm touch-manipulation"
                        >
                          {isInCart(component._id) ? (
                            <span className="sm:hidden">Remove</span>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Add to Cart</span>
                              <span className="sm:hidden">Add</span>
                            </>
                          )}
                          <span className="hidden sm:inline">
                            {isInCart(component._id) ? " from Cart" : ""}
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
          )}

          {!loading && components.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground text-sm sm:text-base px-4">
                Try adjusting your search terms or category filters.
              </p>
            </div>
          )}

          {/* Popular Categories */}
          {!loading && categories.length > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;