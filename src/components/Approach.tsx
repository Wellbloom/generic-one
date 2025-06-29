
const Approach = () => {
  const approaches = [
    {
      title: "Dance & Movement Therapy",
      description: "Release trauma stored in the body through mindful movement and dance, allowing emotions to flow naturally.",
      icon: "💃",
      color: "from-sage/50 to-earth/50"
    },
    {
      title: "Art & Creative Expression",
      description: "Express what words cannot through art, painting, and creative mediums that speak to your soul.",
      icon: "🎨",
      color: "from-earth/50 to-sage/50"
    },
    {
      title: "Yoga & Mindfulness",
      description: "Integrate breath, body awareness, and mindful movement to cultivate inner peace and resilience.",
      icon: "🧘‍♀️",
      color: "from-forest/20 to-sage/50"
    },
    {
      title: "Meditation & Spirituality",
      description: "Connect with your inner wisdom through meditation and spiritual practices that honor your beliefs.",
      icon: "🌱",
      color: "from-sage/50 to-forest/20"
    },
    {
      title: "Trauma-Informed Therapy",
      description: "Gentle, safe approaches to healing trauma using EMDR, somatic experiencing, and other evidence-based methods.",
      icon: "🌿",
      color: "from-earth/50 to-forest/20"
    },
    {
      title: "Holistic Integration",
      description: "Weave together all aspects of your being - mind, body, and spirit - for comprehensive healing.",
      icon: "✨",
      color: "from-forest/20 to-earth/50"
    }
  ];

  return (
    <section id="approach" className="py-20 bg-gradient-to-br from-sage/20 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-6">
              My Integrative Approach
            </h2>
            <p className="text-xl text-moss/80 leading-relaxed max-w-3xl mx-auto">
              Healing happens when we address the whole person. I combine evidence-based therapeutic 
              techniques with creative and somatic approaches to help you find your path to wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${approach.color} flex items-center justify-center text-2xl mb-6`}>
                  {approach.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-forest mb-4">
                  {approach.title}
                </h3>
                <p className="text-moss/80 leading-relaxed">
                  {approach.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-serif font-bold text-forest mb-6 text-center">
              What to Expect in Our Sessions
            </h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-moss mb-2">Initial Assessment</h4>
                    <p className="text-moss/70">We'll explore your goals, history, and preferred modalities to create your personalized treatment plan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-moss mb-2">Integrated Sessions</h4>
                    <p className="text-moss/70">Each session blends talk therapy with movement, creativity, and mindfulness as feels right for you.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-moss mb-2">Ongoing Support</h4>
                    <p className="text-moss/70">Regular check-ins and adjustments to ensure your healing journey stays aligned with your needs.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
                  alt="Peaceful healing environment"
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
