import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-8">
        <Zap className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center">
        This page doesn't exist in our workforce.
      </p>
      <Link 
        to="/" 
        className="
          flex items-center gap-2 px-6 py-3 rounded-xl
          bg-foreground text-background font-semibold
          hover:opacity-90 transition-opacity duration-200
          press-effect
        "
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </Link>
    </div>
  );
};

export default NotFound;
