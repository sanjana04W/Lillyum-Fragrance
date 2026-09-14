'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, ChevronDown, Phone, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SOCIAL_LINKS } from '@/lib/constants';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop' },
  {
    label: 'Collections',
    href: '#',
    children: [
      { label: "Men's Fragrances", href: '/shop/men' },
      { label: "Women's Fragrances", href: '/shop/women' },
      { label: 'Unisex', href: '/shop/unisex' },
      { label: 'EDP', href: '/shop/edp' },
      { label: 'EDT', href: '/shop/edt' },
      { label: 'Extrait', href: '/shop/extrait' },
    ],
  },
  { label: 'New Arrivals', href: '/shop/new-arrivals' },
  { label: 'Best Sellers', href: '/shop/best-sellers' },
  { label: 'Offers', href: '/offers', highlight: true },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div className="bg-brand-charcoal text-brand-gold-lighter text-center text-xs py-2 px-4 tracking-wide">
        🚚 Free delivery on orders over LKR 15,000 &nbsp;·&nbsp; Cash on Delivery island-wide &nbsp;·&nbsp;
        <a href="https://wa.me/94752369613" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white transition-colors">
          WhatsApp: 0752 369 613
        </a>
      </div>

      <header
        className={`sticky top-0 z-50 bg-brand-white transition-shadow duration-300 ${
          scrolled ? 'shadow-soft-lg border-b border-brand-light' : 'border-b border-brand-light/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand-gold/20 group-hover:ring-brand-gold/50 transition-all duration-300">
                <Image
                  src="/logo.jpg"
                  alt="Lillyum Fragrance Studio"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="font-serif text-xl font-bold text-brand-charcoal tracking-wide">
                  LILLYUM
                </p>
                <p className="text-[10px] text-brand-mid uppercase tracking-[0.2em] -mt-0.5">
                  Fragrance Studio
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-brand-dark hover:text-brand-gold rounded-lg hover:bg-brand-gold-soft transition-all duration-200">
                      {link.label}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-brand-white border border-brand-light rounded-2xl shadow-card-hover py-2 animate-fade-in z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      link.highlight
                        ? 'bg-brand-gold text-white hover:bg-brand-gold-dark shadow-gold'
                        : pathname === link.href
                        ? 'text-brand-gold bg-brand-gold-soft font-semibold'
                        : 'text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2">
              {/* WhatsApp quick contact */}
              <a
                href="https://wa.me/94752369613"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-brand-mid hover:text-brand-gold transition-colors px-2 py-1"
              >
                <Phone size={13} />
                <span>0752 369 613</span>
              </a>

              {/* Account */}
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-brand-mid hover:text-brand-gold hover:bg-brand-gold-soft transition-all duration-200"
                  aria-label="Account"
                >
                  <User size={19} />
                </button>
                {accountOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-brand-white border border-brand-light rounded-2xl shadow-card-hover py-2 z-50 animate-fade-in">
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                    >
                      <User size={14} />
                      Sign In
                    </Link>
                    <div className="border-t border-brand-light mx-3 my-1" />
                    <Link
                      href="/register"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-gold text-white hover:bg-brand-gold-dark transition-all duration-200 shadow-gold"
                aria-label="Open cart"
              >
                <ShoppingCart size={17} />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-brand-mid hover:text-brand-gold hover:bg-brand-gold-soft transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-brand-white border-t border-brand-light animate-slide-up shadow-soft-lg">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-0.5">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="text-brand-muted text-[10px] uppercase tracking-widest font-semibold px-3 pt-3 pb-1">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-5 py-2.5 text-sm text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      link.highlight
                        ? 'bg-brand-gold text-white font-semibold mt-1'
                        : pathname === link.href
                        ? 'text-brand-gold bg-brand-gold-soft font-semibold'
                        : 'text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4 mt-2 border-t border-brand-light space-y-0.5 px-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft rounded-lg transition-colors"
                >
                  <User size={15} /> Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft rounded-lg transition-colors"
                >
                  <User size={15} /> Create Account
                </Link>
              </div>
              <div className="pt-3 mt-1 border-t border-brand-light flex gap-4 px-3">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-muted text-xs hover:text-brand-gold transition-colors">Instagram</a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-muted text-xs hover:text-brand-gold transition-colors">Facebook</a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="text-brand-muted text-xs hover:text-brand-gold transition-colors">TikTok</a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
