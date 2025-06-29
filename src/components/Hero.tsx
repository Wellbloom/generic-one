import silviaImage from "@/assets/images/silvia-labra.jpeg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage/20 to-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <div className="w-48 h-48 mx-auto mb-8 relative animate-fade-in" style={{animationDelay:'0.1s'}}>
              <img
                src={silviaImage}
                alt="Silvia Labra Osuna"
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4 animate-slide-up" style={{animationDelay:'0.25s'}}>
              Silvia Labra Osuna
            </h1>
            <p className="text-xl text-moss/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay:'0.35s'}}>
              Psychotherapist integrating art, yoga, dance, mindfulness and ayurveda for holistic healing and transformation.
            </p>
          </div>

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
