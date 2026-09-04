import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "DMA Institute", href: "/institute" },
  { name: "DMA BlueData Hub", href: "/dma-bluedata-hub" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

const moreLinks = [
  { name: "Awards & Recognition", href: "/awards" },
  { name: "Partnerships", href: "/partnerships" },
  { name: "Community", href: "/community" },
  { name: "Blog & Insights", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-[#0f2744] text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/assets/deemarine-logo.png"
              alt="DeeMarine Analytics"
              className="h-16 w-auto object-contain"
            />
            <p className="text-slate-300 text-sm leading-relaxed">
              Sea to Screen — Maritime Decisions Powered by Data
            </p>
            <p className="text-slate-400 text-sm">
              Let's learn, analyze and transform together.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-blue-400 text-sm font-medium">DMA BlueData Hub</p>
              <p className="text-slate-400 text-xs mt-1">Real Maritime Data. Real Projects. Real Impact.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-blue-400 text-sm transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              More
            </h4>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-blue-400 text-sm transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:info@deemarineanalytics.ca"
                  className="text-slate-300 hover:text-blue-400 text-sm transition-colors"
                >
                  info@deemarineanalytics.ca
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <a
                  href="tel:+19025370926"
                  className="text-slate-300 hover:text-blue-400 text-sm transition-colors"
                >
                  +1 902 537 0926
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm">
                  Nova Scotia, Canada
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} DeeMarine Analytics. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            www.deemarineanalytics.ca
          </p>
        </div>
      </div>
    </footer>
  );
}