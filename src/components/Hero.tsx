import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import doctorImage from "@/assets/images/jean-grey.jpeg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-cream pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-72 h-72 mx-auto mb-12 relative animate-fade-in" style={{animationDelay:'0.1s'}}>
            <img
              src={doctorImage}
              alt="Jean Grey"
              className="w-full h-full rounded-full object-cover shadow-lg object-[center_35%]"
            />
          </div>
          <h1 className="text-4xl font-serif font-bold text-center mb-4">
            Jean Grey
          </h1>
          <p className="text-xl text-moss/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay:'0.35s'}}>
            Psychotherapist integrating art, yoga, dance, mindfulness and ayurveda for holistic healing and transformation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay:'0.5s'}}>
            <button
              onClick={scrollToContact}
              className="bg-forest text-white px-8 py-3 rounded-full hover:bg-moss transition-all duration-200 shadow-lg"
            >
              Book Trial Session
            </button>
            <button
              onClick={() => {
                const target = document.getElementById('about');
                if (!target) return;
                const headerEl = document.querySelector('header');
                const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 0;
                const targetTop = target.getBoundingClientRect().top + window.scrollY;
                const offset = targetTop - headerHeight + 48; // same offset as nav links
                window.scrollTo({ top: offset, behavior: 'smooth' });
              }}
              className="border border-forest text-forest px-8 py-3 rounded-full hover:bg-forest hover:text-white transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
