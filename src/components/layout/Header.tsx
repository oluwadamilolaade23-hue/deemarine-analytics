import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn } from "lucide-react";

const navigation = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "DMA Institute", href: "/institute" },
  { name: "DMA BlueData Hub", href: "/dma-bluedata-hub" },
  { name: "Projects", href: "/projects" },
  { name: "Awards & Recognition", href: "/awards" },
  { name: "Partnerships", href: "/partnerships" },
  { name: "Community", href: "/community" },
  { name: "Blog & Insights", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="container-max flex h-18 md:h-22 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-4 shrink-0">
          <img
            src="/assets/deemarine-logo.png"
            alt="DeeMarine Analytics"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 ml-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                location.pathname === item.href
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Portal Login Button */}
        <a href="https://bluedata-hub-staging.vercel.app" className="hidden xl:flex items-center gap-2 ml-2 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
          <LogIn className="h-4 w-4" />
          Fellow Login
        </a>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-1 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 cursor-pointer ${
                    location.pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a href="https://bluedata-hub-staging.vercel.app" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-base font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer mt-2">
                <LogIn className="h-4 w-4" />
                Fellow Login
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}