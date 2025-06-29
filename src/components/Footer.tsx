const Footer = () => {
  return (
    <footer className="bg-forest text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-serif font-bold">Jean Grey</h3>
            <div className="flex space-x-6">
              {/* ... existing social links ... */}
            </div>
            <p className="text-sm text-gray-600">
              © 2024 Jean Grey. Licensed Clinical Psychologist PSY12345
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
