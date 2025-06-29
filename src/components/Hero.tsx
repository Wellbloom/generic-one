import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import doctorImage from "@/assets/images/jean-grey.jpeg";
import { tailwindClasses } from "@/styles/colors";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-peach-light to-white pt-32 pb-20">
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
              asChild
              size="lg"
              className={`${tailwindClasses.primary.bg} text-white transition-colors`}
            >
              <Link to="/book-trial">Book Trial Session</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={`${tailwindClasses.secondary.border} ${tailwindClasses.secondary.text} hover:bg-tangerine/10 transition-colors`}
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
