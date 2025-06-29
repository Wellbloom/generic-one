import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BookingCalendar from "./client/sessions/BookingCalendar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showBooking, setShowBooking] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent!",
      description: "I'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-8 text-center">
              Get Started
            </h2>
            <p className="text-center text-moss/80 mb-12">
              Ready to begin your healing journey? Book your free trial session or
              send me a message.
            </p>

            <div className="text-center mb-8">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-forest text-white px-8 py-4 rounded-lg hover:bg-moss transition-colors text-lg font-medium shadow-lg"
              >
                Book Trial Session - Free
              </button>
            </div>

            <div className="bg-sage/20 rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-forest mb-4 text-center">
                Or send me a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell me what brings you here..."
                    className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-forest text-white py-3 rounded-lg hover:bg-moss transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="text-moss/70 text-sm space-y-1 text-center">
              <p>📧 heal@silvialabra.com</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 Union City, California</p>
            </div>
          </div>
        </div>
      </section>

      {showBooking && (
        <BookingCalendar
          onClose={() => setShowBooking(false)}
          isTrialBooking={true}
        />
      )}
    </>
  );
};

export default Contact;
