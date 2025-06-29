import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MOCK_DATA } from "@/constants";
import logoImage from "@/assets/images/jean-grey-logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { tailwindClasses } from "@/styles/colors";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Determine current header height (desktop & mobile heights differ).
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 0;

    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    // Scroll slightly PAST the title so the first paragraph is visible.
    const offsetPosition = elementTop - headerHeight + 48; // 48px offset to show more content

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

    // Close the mobile menu if it was open
    setIsMenuOpen(false);
  };

  const handleAuth = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-peach">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              className="h-12 w-auto"
              alt="Jean Grey"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}>
              About
            </Link>
            <Link to="/work" className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}>
              Work
            </Link>
            <Link to="/testimonials" className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}>
              Testimonials
            </Link>
            <Link to="/pricing" className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}>
              Pricing
            </Link>
            <Button asChild size="sm" className={`${tailwindClasses.primary.bg} text-white transition-colors`}>
              <Link to="/book-trial">Book Trial Session</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className={`${tailwindClasses.secondary.border} ${tailwindClasses.secondary.text} hover:bg-tangerine/10 transition-colors`}
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-sage">
            <div className="flex flex-col space-y-4 pt-4">
              {!user ? (
                <>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-moss hover:text-forest transition-colors duration-200 text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("work")}
                    className="text-moss hover:text-forest transition-colors duration-200 text-left"
                  >
                    Work
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-moss hover:text-forest transition-colors duration-200 text-left"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-moss hover:text-forest transition-colors duration-200 text-left"
                  >
                    Pricing
                  </button>

                  <button
                    onClick={handleAuth}
                    className="flex items-center gap-2 text-moss hover:text-forest transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                </>
              ) : (
                <>
                  <span className="text-moss">
                    Welcome back {MOCK_DATA.client.firstName}!
                  </span>
                  <button
                    onClick={handleDashboard}
                    className="text-moss hover:text-forest transition-colors duration-200 text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleAuth}
                    className="bg-forest text-white px-6 py-2 rounded-full hover:bg-moss transition-colors duration-200 text-center"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
