import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, ChevronDown } from "lucide-react";

const navigation = [
  { name: "About DeeMarine", items: [
    { name: "About Us", href: "/about" },
    { name: "Awards & Recognition", href: "/awards" },
    { name: "Partnerships", href: "/partnerships" },
    { name: "Contact", href: "/contact" },
  ] },
  { name: "Solutions & Projects", items: [
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Maritime Intelligence", href: "/maritime-intelligence" },
  ] },
  { name: "Learning & Community", items: [
    { name: "DMA Institute", href: "/institute" },
    { name: "Practice Analytics", href: "/practice-analytics" },
    { name: "DMA BlueData Hub", href: "/dma-bluedata-hub" },
    { name: "Community", href: "/community" },
    { name: "Blog & Insights", href: "/blog" },
  ] },
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
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-2 ml-6">
          {navigation.map((group) => (
            <DropdownMenu key={group.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`gap-2 whitespace-nowrap ${group.items.some((item) => location.pathname === item.href) ? "text-blue-600 bg-blue-50" : "text-slate-700"}`}>
                  {group.name}<ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                {group.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} aria-current={location.pathname === item.href ? "page" : undefined} className={location.pathname === item.href ? "text-blue-600 bg-blue-50" : ""}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
        {/* Portal Login Button */}
        <a href="https://institute.deemarineanalytics.ca/portal" className="hidden lg:flex items-center gap-2 ml-2 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
          <LogIn className="h-4 w-4" />
          BlueData Hub Login
        </a>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <div className="flex flex-col gap-1 mt-8">
              <nav aria-label="Mobile navigation">
                <Accordion type="single" collapsible defaultValue={navigation.find((group) => group.items.some((item) => item.href === location.pathname))?.name}>
                  {navigation.map((group) => (
                    <AccordionItem key={group.name} value={group.name}>
                      <AccordionTrigger className="text-base text-slate-700 hover:text-blue-600 hover:no-underline">{group.name}</AccordionTrigger>
                      <AccordionContent>
                        {group.items.map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => setOpen(false)} aria-current={location.pathname === item.href ? "page" : undefined} className={`block px-4 py-3 text-sm font-medium rounded-md ${location.pathname === item.href ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"}`}>{item.name}</Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </nav>
              <a href="https://institute.deemarineanalytics.ca/portal" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-base font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer mt-2">
                <LogIn className="h-4 w-4" />
                BlueData Hub Login
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}