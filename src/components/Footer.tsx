const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange/10 via-orange/5 to-white py-12 border-t border-orange/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-serif font-bold bg-gradient-to-r from-orange to-orange-dark bg-clip-text text-transparent">Jean Grey</h3>
            <div className="flex space-x-6">
              {/* ... existing social links ... */}
            </div>
            <p className="text-sm text-moss/60">
              © 2024 Jean Grey. Licensed Clinical Psychologist PSY12345
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
