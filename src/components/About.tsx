const About = () => {
  return (
    <section id="about" className="py-20 bg-white animate-fade-in" style={{animationDelay:'0.2s'}}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-8">
            My Approach
          </h2>
          <p className="text-lg text-moss/80 leading-relaxed mb-8">
            I believe healing happens when we address the whole person. My integrative approach 
            combines traditional therapy with creative and somatic practices to help you find 
            your unique path to wellness.
          </p>
          
          {/* Grid with two columns; each pair of items shares the same row */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mt-12">
            {/* Row 1 */}
            <div className="text-left space-y-2 animate-slide-up" style={{animationDelay:'0.3s'}}>
              <h3 className="font-semibold text-forest">Dance & Movement Therapy</h3>
              <p className="text-moss/70">Release trauma stored in the body through mindful movement</p>
            </div>
            <div className="text-left space-y-2 animate-slide-up" style={{animationDelay:'0.4s'}}>
              <h3 className="font-semibold text-forest">Mindfulness & Meditation</h3>
              <p className="text-moss/70">Cultivate inner peace and body awareness</p>
            </div>

            {/* Row 2 */}
            <div className="text-left space-y-2 animate-slide-up" style={{animationDelay:'0.5s'}}>
              <h3 className="font-semibold text-forest">Art & Creative Expression</h3>
              <p className="text-moss/70">Express what words cannot through creative mediums</p>
            </div>
            <div className="text-left space-y-2 animate-slide-up" style={{animationDelay:'0.6s'}}>
              <h3 className="font-semibold text-forest">Trauma-Informed Care</h3>
              <p className="text-moss/70">Gentle, evidence-based approaches to healing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
