// Filename: Work.tsx
// Role: Work showcase component displaying therapeutic work samples
// Purpose: Shows examples of therapeutic work in different modalities with horizontal scroll
// Integration: Used on main website to showcase therapist's work and expertise

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { tailwindClasses } from "@/styles/colors";

const Work = () => {
  const [currentCategory, setCurrentCategory] = useState("All");

  const workSamples = [
    {
      id: 1,
      category: "Podcast",
      title: "Wellness Wednesday Podcast",
      excerpt:
        "Weekly podcast exploring holistic wellness, mental health tips, and inspiring guest stories.",
      fullContent:
        "Join Jean Grey every Wednesday for insightful conversations on mental health, self-care, and integrative wellness with expert guests and real-life stories.",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      category: "Mindfulness",
      title: "Mindfulness & Meditation Classes",
      excerpt:
        "Guided mindfulness and meditation sessions to help you find calm, clarity, and resilience.",
      fullContent:
        "Experience the benefits of mindfulness and meditation in a supportive group setting. Learn practical techniques for stress reduction and emotional balance.",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      category: "Workshops",
      title: "Anxiety Management Workshop",
      excerpt:
        "Interactive workshop offering tools and strategies to manage anxiety and build coping skills.",
      fullContent:
        "This workshop provides evidence-based techniques for understanding and managing anxiety, including cognitive-behavioral tools and relaxation exercises.",
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      category: "Seminars",
      title: "Relationship Skills Seminar",
      excerpt:
        "Learn effective communication, conflict resolution, and emotional intelligence for healthier relationships.",
      fullContent:
        "This seminar is designed to help individuals and couples develop the skills needed for strong, fulfilling relationships.",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      category: "Groups",
      title: "Group Therapy Sessions",
      excerpt:
        "Supportive group sessions for shared healing, connection, and personal growth.",
      fullContent:
        "Join a safe, confidential group environment to explore challenges, share experiences, and build resilience together.",
      image:
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 6,
      category: "Courses",
      title: "Self-Esteem Building Course",
      excerpt:
        "A structured course to help you develop confidence, self-worth, and a positive self-image.",
      fullContent:
        "Through interactive lessons and exercises, this course empowers you to overcome self-doubt and embrace your strengths.",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 7,
      category: "Support Groups",
      title: "Trauma Recovery Support Group",
      excerpt:
        "A safe space for survivors to share, heal, and support each other on the journey to recovery.",
      fullContent:
        "Facilitated by Jean Grey, this group offers trauma-informed support and practical tools for healing.",
      image:
        "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 8,
      category: "Creative Workshops",
      title: "Creative Expression Workshops",
      excerpt:
        "Explore art, music, and movement as pathways to self-discovery and emotional release.",
      fullContent:
        "These workshops use creative modalities to foster healing, self-awareness, and personal growth in a supportive environment.",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
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
        className="py-20"
      >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-orange to-tangerine bg-clip-text text-transparent mb-6">
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
                    ? `${tailwindClasses.primary.bg.replace('hover:', '')} text-white shadow-lg`
                    : `bg-white text-moss border border-sage/30 hover:bg-orange/10 hover:${tailwindClasses.primary.border.replace('border-', 'border-')}/50`
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
              <ChevronLeft className={`w-5 h-5 ${tailwindClasses.primary.text}`} />
            </button>
            <button
              onClick={() => scrollContainer("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className={`w-5 h-5 ${tailwindClasses.primary.text}`} />
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
                      <span className={`bg-orange/90 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {work.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold bg-gradient-to-r from-orange to-orange-dark bg-clip-text text-transparent mb-3 line-clamp-2">
                      {work.title}
                    </h3>

                    <p className="text-moss/80 mb-4 line-clamp-3">
                      {work.excerpt}
                    </p>
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
              className={`${tailwindClasses.primary.bg} text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg font-medium`}
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
