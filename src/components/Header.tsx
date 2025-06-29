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

  const handleBookTrial = () => {
    scrollToSection("contact");
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
            <button
              onClick={() => scrollToSection("about")}
              className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("work")}
              className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}
            >
              Work
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors`}
            >
              Pricing
            </button>
            <Button
              onClick={handleBookTrial}
              size="sm"
              className={`${tailwindClasses.primary.bg} text-white transition-colors`}
            >
              Book Trial Session
            </Button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleDashboard}
                  variant="outline"
                  size="sm"
                  className={`${tailwindClasses.secondary.border} ${tailwindClasses.secondary.text} hover:bg-tangerine/10 transition-colors`}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleAuth}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAuth}
                variant="outline"
                size="sm"
                className={`${tailwindClasses.secondary.border} ${tailwindClasses.secondary.text} hover:bg-tangerine/10 transition-colors`}
              >
                Login
              </Button>
            )}
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
                    className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200 text-left`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("work")}
                    className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200 text-left`}
                  >
                    Work
                  </button>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200 text-left`}
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200 text-left`}
                  >
                    Pricing
                  </button>
                  <button
                    onClick={handleAuth}
                    className={`flex items-center gap-2 text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200`}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-600">
                    Welcome back {MOCK_DATA.client.firstName}!
                  </span>
                  <button
                    onClick={handleDashboard}
                    className={`text-gray-600 hover:${tailwindClasses.primary.text.replace('text-', '')} transition-colors duration-200 text-left`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleAuth}
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-center"
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
