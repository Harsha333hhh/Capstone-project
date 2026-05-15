function Footer() {
  return (
    <footer className="bg-pink-200 border-t border-pink-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left - brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <span className="text-gray-600 font-semibold">BlogApp</span>
        </div>

        {/* Center - copyright */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} BlogApp. All rights reserved.
        </p>

        {/* Right - links */}
        <div className="flex gap-5 text-sm text-gray-500">
          <span className="hover:text-blue-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-blue-400 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;