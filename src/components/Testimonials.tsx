import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { tailwindClasses } from "@/styles/colors";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      age: 32,
      location: "San Francisco, CA",
      content:
        "Jean's integrative approach helped me heal from postpartum depression in ways I never imagined. The combination of talk therapy with movement allowed me to express feelings I couldn't put into words.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Dance & Movement Therapy",
    },
    {
      name: "Michael R.",
      age: 45,
      location: "Oakland, CA",
      content:
        "After years of traditional therapy for PTSD, Jean's trauma-informed approach with meditation and somatic work has been life-changing. I sleep better and feel more connected.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Trauma-Informed Care",
    },
    {
      name: "Elena P.",
      age: 28,
      location: "Union City, CA",
      content:
        "The dance therapy sessions have been transformative. She created such a safe space for me to explore my grief. Through movement, I've found a new relationship with my emotions.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Dance & Movement Therapy",
    },
    {
      name: "David K.",
      age: 38,
      location: "Fremont, CA",
      content:
        "The art therapy sessions unlocked creativity I didn't know I had. Through painting and drawing, I processed childhood trauma in a way that felt safe and empowering.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Art & Creative Expression",
    },
    {
      name: "Maria S.",
      age: 41,
      location: "Hayward, CA",
      content:
        "Jean's mindfulness techniques have become essential tools in managing my anxiety. Her gentle guidance helped me find peace I never thought possible.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Mindfulness & Meditation",
    },
    {
      name: "James L.",
      age: 35,
      location: "Newark, CA",
      content:
        "Working with Jean transformed my relationship with my body after a sports injury. The movement therapy helped me rebuild not just physically, but emotionally too.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Dance & Movement Therapy",
    },
    {
      name: "Ana R.",
      age: 29,
      location: "San Leandro, CA",
      content:
        "The creative expression sessions gave me a voice when words failed. Through collage and journaling, I discovered strength I didn't know I possessed.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Art & Creative Expression",
    },
    {
      name: "Robert W.",
      age: 52,
      location: "Castro Valley, CA",
      content:
        "After losing my spouse, I thought I'd never find peace again. Jean's compassionate approach and trauma-informed techniques helped me process my grief with dignity.",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      sessionType: "Trauma-Informed Care",
    },
  ];

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("testimonials-scroll-container");
    if (container) {
      const scrollAmount = 350; // Width of card + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-br from-sage/10 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-6">
              Client Stories
            </h2>
            <p className="text-lg text-moss/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Real experiences from clients who have found healing through our
              integrated therapeutic approach
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollContainer("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className={`w-5 h-5 ${tailwindClasses.primary.text}`} />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className={`w-5 h-5 ${tailwindClasses.primary.text}`} />
            </button>

            {/* Scrollable Testimonial Cards */}
            <div
              id="testimonials-scroll-container"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-none w-80 bg-white rounded-2xl shadow-lg transition-shadow duration-300 group"
                >
                  {/* Client Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-sage/20"
                      />
                      <div>
                        <p className="font-semibold text-forest text-lg">
                          {testimonial.name}
                        </p>
                        <p className="text-moss/60 text-sm">
                          {testimonial.age} • {testimonial.location}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="ml-2 text-sm text-moss/60">
                        {testimonial.sessionType}
                      </span>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="px-6 pb-6">
                    <p className="text-moss leading-relaxed italic text-base">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-moss/70 mb-6">
              Ready to start your own healing journey?
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`${tailwindClasses.primary.bg} text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg font-medium`}
            >
              Book Your Trial Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
