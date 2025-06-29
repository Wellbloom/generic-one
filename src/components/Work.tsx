// Filename: Work.tsx
// Role: Work showcase component displaying therapeutic work samples
// Purpose: Shows examples of therapeutic work in different modalities with horizontal scroll
// Integration: Used on main website to showcase therapist's work and expertise

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const Work = () => {
  const [currentCategory, setCurrentCategory] = useState("All");

  const workSamples = [
    // Dance & Movement Therapy
    {
      id: 1,
      category: "Dance & Movement Therapy",
      title: "Healing Through Sacred Movement",
      excerpt:
        "Exploring how traditional dance forms can unlock emotional healing and create pathways to self-discovery through embodied expression...",
      fullContent:
        "A comprehensive exploration of how movement therapy integrates with traditional therapeutic practices to create profound healing experiences.",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
      date: "March 2024",
      readTime: "5 min read",
    },
    {
      id: 2,
      category: "Dance & Movement Therapy",
      title: "Body Wisdom: Listening to Physical Trauma",
      excerpt:
        "Understanding how trauma manifests in the body and using movement to process and release stored emotional energy...",
      fullContent:
        "A deep dive into somatic experiencing and how movement therapy helps clients reconnect with their body's innate wisdom.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
      date: "February 2024",
      readTime: "7 min read",
    },
    {
      id: 3,
      category: "Dance & Movement Therapy",
      title: "Rhythm as Medicine: Cultural Movement Healing",
      excerpt:
        "Integrating cultural dance traditions into therapeutic practice to honor heritage while fostering healing and connection...",
      fullContent:
        "Exploring how cultural movement practices can be integrated into modern therapy to create culturally responsive healing.",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
      date: "January 2024",
      readTime: "6 min read",
    },
    {
      id: 4,
      category: "Dance & Movement Therapy",
      title: "Movement Meditation for Anxiety Relief",
      excerpt:
        "Combining gentle movement with mindfulness practices to create accessible tools for managing anxiety and stress...",
      fullContent:
        "A practical guide to using movement meditation as a therapeutic intervention for anxiety and stress management.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      date: "December 2023",
      readTime: "4 min read",
    },

    // Art & Creative Expression
    {
      id: 5,
      category: "Art & Creative Expression",
      title: "Colors of Emotion: Art Therapy Techniques",
      excerpt:
        "Using color psychology and artistic expression to help clients process complex emotions that are difficult to verbalize...",
      fullContent:
        "An exploration of how art therapy creates safe spaces for emotional expression and psychological healing.",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80",
      date: "March 2024",
      readTime: "5 min read",
    },
    {
      id: 6,
      category: "Art & Creative Expression",
      title: "Creative Journaling for Self-Discovery",
      excerpt:
        "Combining writing, drawing, and collage techniques to create powerful tools for self-reflection and personal growth...",
      fullContent:
        "A comprehensive guide to therapeutic journaling practices that integrate multiple creative modalities.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
      date: "February 2024",
      readTime: "6 min read",
    },
    {
      id: 7,
      category: "Art & Creative Expression",
      title: "Mandala Making as Therapeutic Practice",
      excerpt:
        "Exploring the meditative and healing properties of mandala creation in individual and group therapy settings...",
      fullContent:
        "Understanding how mandala creation facilitates mindfulness, self-awareness, and emotional regulation.",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
      date: "January 2024",
      readTime: "7 min read",
    },
    {
      id: 8,
      category: "Art & Creative Expression",
      title: "Digital Art Therapy for Modern Healing",
      excerpt:
        "Adapting traditional art therapy techniques for digital platforms while maintaining therapeutic integrity...",
      fullContent:
        "Exploring how technology can expand access to art therapy while preserving its essential healing qualities.",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
      date: "December 2023",
      readTime: "5 min read",
    },

    // Mindfulness & Meditation
    {
      id: 9,
      category: "Mindfulness & Meditation",
      title: "Breathwork for Emotional Regulation",
      excerpt:
        "Teaching clients powerful breathing techniques to manage overwhelming emotions and create inner calm...",
      fullContent:
        "A practical exploration of how breathwork can be integrated into therapy for emotional regulation and stress management.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      date: "March 2024",
      readTime: "6 min read",
    },
    {
      id: 10,
      category: "Mindfulness & Meditation",
      title: "Walking Meditation in Nature Therapy",
      excerpt:
        "Combining the healing power of nature with mindful walking practices for grounding and peace...",
      fullContent:
        "Understanding how nature-based mindfulness practices can enhance therapeutic outcomes and well-being.",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
      date: "February 2024",
      readTime: "5 min read",
    },
    {
      id: 11,
      category: "Mindfulness & Meditation",
      title: "Body Scan Meditation for Trauma Recovery",
      excerpt:
        "Using gentle body awareness practices to help trauma survivors reconnect safely with their physical selves...",
      fullContent:
        "A trauma-informed approach to body scan meditation that prioritizes safety and gradual reconnection.",
      image:
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=400&q=80",
      date: "January 2024",
      readTime: "8 min read",
    },
    {
      id: 12,
      category: "Mindfulness & Meditation",
      title: "Loving-Kindness Practice for Self-Compassion",
      excerpt:
        "Cultivating self-compassion through loving-kindness meditation to heal inner criticism and shame...",
      fullContent:
        "Exploring how loving-kindness meditation can transform self-relationship and promote healing from within.",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
      date: "December 2023",
      readTime: "4 min read",
    },

    // Trauma-Informed Care
    {
      id: 13,
      category: "Trauma-Informed Care",
      title: "Creating Safety in Therapeutic Spaces",
      excerpt:
        "Essential principles for establishing physical and emotional safety in trauma-informed therapeutic practice...",
      fullContent:
        "A comprehensive guide to creating therapeutic environments that support healing from trauma with dignity and respect.",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
      date: "March 2024",
      readTime: "7 min read",
    },
    {
      id: 14,
      category: "Trauma-Informed Care",
      title: "EMDR Integration with Somatic Methods",
      excerpt:
        "Combining EMDR therapy with body-based approaches for comprehensive trauma treatment...",
      fullContent:
        "Understanding how EMDR can be enhanced with somatic experiencing for more complete trauma resolution.",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80",
      date: "February 2024",
      readTime: "9 min read",
    },
    {
      id: 15,
      category: "Trauma-Informed Care",
      title: "Cultural Trauma and Healing Practices",
      excerpt:
        "Addressing intergenerational and cultural trauma through culturally responsive therapeutic approaches...",
      fullContent:
        "Exploring how cultural trauma manifests and how culturally informed practices can facilitate healing.",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
      date: "January 2024",
      readTime: "8 min read",
    },
    {
      id: 16,
      category: "Trauma-Informed Care",
      title: "Building Resilience After Trauma",
      excerpt:
        "Supporting clients in developing post-traumatic growth and resilience through integrated therapeutic approaches...",
      fullContent:
        "A framework for supporting clients in not just surviving trauma, but thriving and growing beyond it.",
      image:
        "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?auto=format&fit=crop&w=400&q=80",
      date: "December 2023",
      readTime: "6 min read",
    },
  ];

  const categories = [
    "All",
    "Dance & Movement Therapy",
    "Art & Creative Expression",
    "Mindfulness & Meditation",
    "Trauma-Informed Care",
  ];

  const filteredWork =
    currentCategory === "All"
      ? workSamples
      : workSamples.filter(work => work.category === currentCategory);

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("work-scroll-container");
    if (container) {
      const scrollAmount = 320; // Width of card + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="work"
      className="py-20 bg-gradient-to-br from-white to-sage/10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-6">
              My Therapeutic Work
            </h2>
            <p className="text-lg text-moss/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Explore insights and experiences from my integrative practice,
              where healing happens through the beautiful intersection of
              movement, creativity, and mindfulness.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCurrentCategory(category)}
                className={`px-5 py-2 rounded-full transition-all duration-200 font-medium text-sm ${
                  currentCategory === category
                    ? "bg-forest text-white shadow-lg"
                    : "bg-white text-moss border border-sage/30 hover:bg-sage/20 hover:border-sage/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollContainer("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-forest" />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-forest" />
            </button>

            {/* Scrollable Work Cards */}
            <div
              id="work-scroll-container"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredWork.map(work => (
                <div
                  key={work.id}
                  className="flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Card Image */}
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-forest/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {work.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-moss/60 mb-3">
                      <span>{work.date}</span>
                      <span className="mx-2">•</span>
                      <span>{work.readTime}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-forest mb-3 line-clamp-2">
                      {work.title}
                    </h3>

                    <p className="text-moss/80 mb-4 line-clamp-3">
                      {work.excerpt}
                    </p>

                    <button className="flex items-center text-forest hover:text-moss transition-colors duration-200 font-medium group">
                      Read More
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-moss/70 mb-6">
              Interested in exploring these approaches in your own healing
              journey?
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-forest text-white px-8 py-3 rounded-full hover:bg-moss transition-all duration-200 shadow-lg font-medium"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
