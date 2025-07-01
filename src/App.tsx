import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import JeanGrey from "./pages/JeanGrey";
import { RecurringSessionsSetup } from "./components/client/recurring-sessions";

const queryClient = new QueryClient();

const App = () => {
  console.log("🎯 [DEBUG] App component rendering...");

  try {
    console.log("🎯 [DEBUG] Initializing QueryClient...");

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/auth"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Auth />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/setup-recurring-sessions"
                    element={
                      <ProtectedRoute>
                        <RecurringSessionsSetup
                          onClose={() => window.history.back()}
                          onComplete={() => (window.location.href = "/dashboard")}
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/jean-grey" element={<JeanGrey />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("❌ [ERROR] App component failed to render:", error);

    // Fallback UI for App component errors
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "red" }}>App Component Error</h1>
        <p>The main App component failed to render.</p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {String(error)}
        </pre>
      </div>
    );
  }
};

export default App;
