import { Link } from "react-router-dom";
import { FaXTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-indigo-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-bold text-white">LifeLessons</span>
          </div>
          <p className="text-sm text-indigo-300 leading-relaxed">
            A platform to preserve, share, and grow through meaningful life lessons.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/public-lessons" className="hover:text-white transition">Public Lessons</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white transition">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm mb-1">📧 support@lifelessons.dev</p>
          <p className="text-sm mb-4">📍 Dhaka, Bangladesh</p>
          <div className="flex gap-3 text-xl">
            <a href="#" className="hover:text-white transition"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition"><FaXTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-white transition"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-indigo-700 text-center text-sm text-indigo-400">
        © {new Date().getFullYear()} LifeLessons. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;