const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} <span className="font-medium">Nirman Textile</span>. All rights reserved.
        </p>
        <p className="text-[11px]">
          Premium cotton bedsheets, crafted with care in India.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

