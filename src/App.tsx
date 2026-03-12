import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Chatbot from "@/components/Chatbot";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import CaseStudies from "./pages/CaseStudies";
import FAQ from "./pages/FAQ";
import HelpCentre from "./pages/HelpCentre";
import ArticleDetail from "./pages/ArticleDetail";
import WhatIsAIEmployee from "./pages/WhatIsAIEmployee";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import GetStarted from "./pages/GetStarted";
import Call from "./pages/Call";
import Connect from "./pages/Connect";
import SEOAudit from "./pages/SEOAudit";
import Admin from "./pages/Admin";
import PreviewArticle from "./pages/PreviewArticle";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import AutopilotSEO from "./pages/AutopilotSEO";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // 301-equivalent: redirect .lovable.app subdomain to live domain
    if (window.location.hostname === "businessbotsuk.lovable.app") {
      window.location.replace("https://businessbotsuk.com" + window.location.pathname + window.location.search);
      return;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help-centre" element={<HelpCentre />} />
            <Route path="/help-centre/article/:slug" element={<ArticleDetail />} />
            <Route path="/what-is-ai-employee" element={<WhatIsAIEmployee />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/call" element={<Call />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/seo-audit" element={<SEOAudit />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/preview/:slug" element={<PreviewArticle />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/autopilot-seo" element={<AutopilotSEO />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Redirects for old/indexed URLs to prevent 404s */}
            <Route path="/product-help" element={<Navigate to="/help-centre" replace />} />
            <Route path="/product-help/*" element={<Navigate to="/help-centre" replace />} />
            <Route path="/products" element={<Navigate to="/" replace />} />
            <Route path="/products/*" element={<Navigate to="/" replace />} />
            <Route path="/services" element={<Navigate to="/" replace />} />
            <Route path="/services/*" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/demo" element={<Navigate to="/book-demo" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
