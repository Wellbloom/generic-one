const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-sage/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-8">
            Investment in Your Healing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trial Session */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage/30 border-2 border-forest">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-forest mb-4">
                  Trial Session
                </h3>
                <div className="text-4xl font-bold text-forest mb-2">
                  Free
                </div>
                <p className="text-moss/70 mb-6">
                  15-minute introductory session
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Get to know each other
                  </div>
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Discuss your goals
                  </div>
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    See if we're a good fit
                  </div>
                </div>
              </div>
            </div>

            {/* Full Session */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-sage/30">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-forest mb-4">
                  Individual Session
                </h3>
                <div className="text-4xl font-bold text-forest mb-2">
                  $79
                </div>
                <p className="text-moss/70 mb-6">
                  60-minute integrative therapy session
                </p>
                
                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Talk therapy combined with movement
                  </div>
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Art and creative expression techniques
                  </div>
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Mindfulness and somatic practices
                  </div>
                  <div className="flex items-center text-moss/80">
                    <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>
                    Trauma-informed approach
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-moss/60 mt-6">
            Start with a free trial session to see if we're the right fit for your healing journey
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
