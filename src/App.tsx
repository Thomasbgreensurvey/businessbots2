import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
