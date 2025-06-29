import { Button } from "@/components/ui/button";
import doctorImage from "@/assets/images/jean-grey.jpeg";
import { tailwindClasses } from "@/styles/colors";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerEl = document.querySelector("header");
    const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 0;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementTop - headerHeight + 48;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  const handleBookTrial = () => {
    scrollToSection("contact");
  };

  const handleLearnMore = () => {
    scrollToSection("about");
  };

  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-72 h-72 mx-auto mb-12 relative animate-fade-in" style={{animationDelay:'0.1s'}}>
            <img
              src={doctorImage}
              alt="Jean Grey"
              className="w-full h-full rounded-full object-cover shadow-lg object-[center_35%]"
            />
          </div>
          <h1 className={`text-4xl font-serif font-bold ${tailwindClasses.primary.text} mb-4`}>
            Jean Grey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay:'0.35s'}}>
            Licensed psychotherapist integrating art, yoga, and mindfulness for holistic healing and transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay:'0.5s'}}>
            <Button
              onClick={handleBookTrial}
              size="lg"
              className={`${tailwindClasses.primary.bg} text-white transition-colors`}
            >
              Book Trial Session
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              size="lg"
              className={`${tailwindClasses.secondary.border} ${tailwindClasses.secondary.text} hover:bg-tangerine/10 transition-colors`}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
