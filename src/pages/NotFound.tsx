import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md" data-reveal>
        {/* Decorative element */}
        <div className="w-16 h-px bg-gold mx-auto mb-8" />
        
        {/* 404 */}
        <span className="font-serif text-8xl md:text-9xl text-gold/20 block mb-4">404</span>
        
        <h1 className="font-serif text-2xl md:text-3xl mb-4 text-foreground">
          Seite nicht gefunden
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Die angeforderte Seite existiert nicht oder wurde verschoben. 
          Kehren Sie zur Startseite zurück oder erkunden Sie unsere Immobilien.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="rounded-none">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-none border-border/60">
            <Link to="/immobilien">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Immobilien ansehen
            </Link>
          </Button>
        </div>
        
        {/* Decorative element */}
        <div className="w-16 h-px bg-gold mx-auto mt-10" />
      </div>
    </div>
  );
};

export default NotFound;
