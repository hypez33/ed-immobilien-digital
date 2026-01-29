import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ConsentProvider } from "@/context/ConsentContext";
import { RequireAuth } from "@/components/admin/RequireAuth";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ScrollToTop } from "@/components/routing/ScrollToTop";
import HomePage from "./pages/HomePage";
import ImmobilienPage from "./pages/ImmobilienPage";
import LeistungenPage from "./pages/LeistungenPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import UeberUnsPage from "./pages/UeberUnsPage";
import KontaktPage from "./pages/KontaktPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBlogPage from "./pages/admin/AdminBlogPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ConsentProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/immobilien" element={<ImmobilienPage />} />
              <Route path="/leistungen" element={<LeistungenPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/ueber-uns" element={<UeberUnsPage />} />
              <Route path="/kontakt" element={<KontaktPage />} />
              <Route path="/impressum" element={<ImpressumPage />} />
              <Route path="/datenschutz" element={<DatenschutzPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/blog" element={<AdminBlogPage />} />
                <Route path="/admin/anfragen" element={<AdminLeadsPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ConsentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
