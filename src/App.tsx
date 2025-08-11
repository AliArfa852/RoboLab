import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Assistant from "./pages/Assistant";
import Store from "./pages/Store";
import Ideas from "./pages/Ideas";
import Designer from "./pages/Designer";
import Projects from "./pages/Projects";
import Auth from "./pages/Auth";
import Cookies from "./pages/Cookies";
import ComingSoon from "./pages/ComingSoon";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="robolab-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/store" element={<Store />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/designer" element={<Designer />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
