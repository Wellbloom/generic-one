import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Index = () => {
  console.log("🏠 [DEBUG] Index page rendering...");

  try {
    console.log("🏠 [DEBUG] Loading main page components...");

    return (
      <div className="min-h-screen relative">
        {/* Cyclic Background Gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-orange/20 via-orange/5 to-white"></div>
        <div 
          className="fixed inset-0 -z-10" 
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(255, 165, 0, 0.15) 0%,
                rgba(255, 200, 100, 0.08) 15%,
                rgba(255, 255, 255, 0) 30%,
                rgba(255, 255, 255, 1) 45%,
                rgba(255, 255, 255, 1) 55%,
                rgba(255, 200, 100, 0.05) 70%,
                rgba(255, 165, 0, 0.12) 85%,
                rgba(255, 140, 0, 0.18) 100%
              )
            `
          }}
        ></div>
        
        <Header />
        <Hero />
        <About />
        <Work />
        <Testimonials />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("❌ [ERROR] Index page failed to render:", error);

    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "red" }}>Index Page Error</h1>
        <p>The main Index page failed to render.</p>
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

export default Index;
