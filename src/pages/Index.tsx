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
      <div className="min-h-screen">
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
