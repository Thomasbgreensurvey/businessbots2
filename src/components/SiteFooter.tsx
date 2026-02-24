import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

// North East & Nationwide location silos for SEO interlinks
const locationSilos = {
  "North East": [
    "Newcastle upon Tyne",
    "Sunderland",
    "Durham",
    "Gateshead",
    "Darlington",
    "Middlesbrough",
    "Hartlepool",
    "Gosforth",
    "Jesmond",
    "Tynemouth",
    "Whitley Bay",
    "South Shields",
    "Hexham",
    "Morpeth",
    "Alnwick",
    "Cramlington",
    "Blyth",
    "Washington",
  ],
  Nationwide: [
    "London",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Liverpool",
    "Sheffield",
    "Bristol",
    "Edinburgh",
    "Glasgow",
    "Cardiff",
    "Belfast",
    "Nottingham",
    "Leicester",
    "Brighton",
    "Cambridge",
    "Oxford",
    "York",
    "Bath",
  ],
};

const serviceSilos = [
  { label: "AI Sales Automation", to: "/#agents" },
  { label: "AI Customer Support", to: "/#agents" },
  { label: "AI Lead Generation", to: "/#agents" },
  { label: "AI Email Marketing", to: "/#agents" },
  { label: "AI Social Media", to: "/#agents" },
  { label: "AI Recruitment", to: "/#agents" },
  { label: "AI HR & Onboarding", to: "/#agents" },
  { label: "AI Call Handling", to: "/#agents" },
];

const SiteFooter = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", to: "/what-is-ai-employee" },
                { label: "Pricing", to: "/pricing" },
                { label: "Case Studies", to: "/case-studies" },
                { label: "Blog", to: "/blog" },
                { label: "Contact", to: "/contact" },
                { label: "Community", to: "/community" },
                { label: "FAQ", to: "/faq" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/50 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">AI Services</h3>
            <ul className="space-y-2">
              {serviceSilos.map((silo) => (
                <li key={silo.label}>
                  <Link to={silo.to} className="text-white/50 hover:text-white transition-colors text-sm">
                    {silo.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* North East Coverage */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              North East Coverage
            </h3>
            <ul className="space-y-1">
              {locationSilos["North East"].map((city) => (
                <li key={city}>
                  <span className="text-white/40 text-xs hover:text-white/60 transition-colors cursor-default">
                    AI Solutions {city}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nationwide Coverage */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Nationwide Coverage
            </h3>
            <ul className="space-y-1">
              {locationSilos.Nationwide.map((city) => (
                <li key={city}>
                  <span className="text-white/40 text-xs hover:text-white/60 transition-colors cursor-default">
                    AI Solutions {city}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Address & Contact Bar */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/50 text-xs">
                <strong className="text-white/70">HQ:</strong> The Beacon Business Centre, Westgate Road, Newcastle upon Tyne, NE4 9PQ
              </p>
              <p className="text-white/50 text-xs mt-1">
                <strong className="text-white/70">Phone:</strong>{" "}
                <a href="tel:08006546949" className="hover:text-white transition-colors">
                  0800 654 6949
                </a>{" "}
                |{" "}
                <strong className="text-white/70">Email:</strong>{" "}
                <a href="mailto:ai@businessbotsuk.com" className="hover:text-white transition-colors">
                  ai@businessbotsuk.com
                </a>
              </p>
            </div>
            <p className="text-white/30 text-xs">
              Serving UK, USA, Canada & Ireland — AI Employees Available 24/7
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center gap-6">
          <img src={logo} alt="Business Bots UK" className="h-10 w-auto" />

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            {[
              { href: "https://www.facebook.com/share/1GBJ3HR7T2/?mibextid=wwXIfr", label: "Facebook", svg: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { href: "https://www.tiktok.com/@businessbotsai", label: "TikTok", svg: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" },
              { href: "https://youtube.com/@businessbotsai", label: "YouTube", svg: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              { href: "https://www.instagram.com/businessbotsai", label: "Instagram", svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { href: "https://x.com/businessbotsai", label: "X", svg: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { href: "https://www.linkedin.com/company/business-bots-uk/", label: "LinkedIn", svg: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.svg} />
                </svg>
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 text-xs">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/help-centre" className="hover:text-white transition-colors">Help Centre</Link>
            <span>•</span>
            <Link to="/book-demo" className="hover:text-white transition-colors">Book a Demo</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>

          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()}{" "}
            <Link to="/admin" className="text-white/30 hover:text-white/50 transition-colors cursor-pointer">
              Business Bots UK
            </Link>
            . All rights reserved. AI Employees for Business Automation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
