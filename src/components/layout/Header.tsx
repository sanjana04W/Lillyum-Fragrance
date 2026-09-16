'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, ChevronDown, Phone, User, LogOut, LayoutGrid } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop' },
  {
    label: 'Collections',
    href: '#',
    children: [
      { label: 'Women', href: '/shop/women' },
      { label: 'Men', href: '/shop/men' },
      { label: 'Unisex', href: '/shop/unisex' },
      { label: 'Gift Sets', href: '/shop/gift-sets' },
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
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                    user
                      ? 'text-brand-gold bg-brand-gold-soft hover:bg-brand-gold/20'
                      : 'text-brand-mid hover:text-brand-gold hover:bg-brand-gold-soft'
                  }`}
                  aria-label="Account"
                >
                  {user ? (
                    <span className="w-7 h-7 rounded-full bg-brand-gold text-white text-xs font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </span>
                  ) : (
                    <User size={19} />
                  )}
                </button>
                {accountOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-brand-white border border-brand-light rounded-2xl shadow-card-hover py-2 z-50 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-brand-light mb-1">
                          <p className="text-xs font-semibold text-brand-charcoal truncate">
                            {user.displayName || 'My Account'}
                          </p>
                          <p className="text-[11px] text-brand-mid truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-dark hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                        >
                          <LayoutGrid size={14} />
                          My Profile
                        </Link>
                        <div className="border-t border-brand-light mx-3 my-1" />
                        <button
                          onClick={() => { signOut(); setAccountOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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

        {/* ── Mobile Navigation Drawer (Opposite Side: Right Side, 50% / Half Page Width) ── */}
        {/* Backdrop Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-brand-charcoal/50 backdrop-blur-xs lg:hidden transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Slide-in Drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-1/2 min-w-[240px] max-w-[85vw] bg-brand-white border-l border-brand-light flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Mobile Navigation"
        >
          {/* Drawer Header */}
          <div className="p-4 px-5 border-b border-brand-light flex items-center justify-between bg-brand-cream/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-brand-gold/30 shrink-0">
                <Image src="/logo.jpg" alt="Lillyum" fill className="object-cover" />
              </div>
              <div className="leading-tight">
                <p className="font-serif font-bold text-xs sm:text-sm text-brand-charcoal tracking-wide">
                  LILLYUM
                </p>
                <p className="text-[9px] text-brand-mid uppercase tracking-widest -mt-0.5">
                  Studio
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-cream transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex-1 py-3 px-3 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="pt-2">
                    <p className="text-brand-muted text-[10px] uppercase tracking-widest font-bold px-3 pb-1">
                      {link.label}
                    </p>
                    <div className="space-y-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-xs font-medium text-brand-charcoal/80 hover:text-brand-gold hover:bg-brand-gold-soft rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                      link.highlight
                        ? 'bg-brand-gold text-white shadow-gold mt-1'
                        : pathname === link.href
                        ? 'text-brand-gold bg-brand-gold-soft font-bold'
                        : 'text-brand-charcoal/80 hover:text-brand-gold hover:bg-brand-gold-soft'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Drawer Footer (Auth & Social) */}
          <div className="p-3.5 border-t border-brand-light bg-brand-cream/30 space-y-2.5 shrink-0">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="truncate">{user.displayName || 'My Profile'}</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-charcoal hover:text-brand-gold hover:bg-brand-gold-soft rounded-xl transition-colors"
                >
                  <User size={14} /> Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-charcoal hover:text-brand-gold hover:bg-brand-gold-soft rounded-xl transition-colors"
                >
                  <User size={14} /> Create Account
                </Link>
              </div>
            )}

            <div className="pt-2 border-t border-brand-light/60 flex items-center justify-between text-[10px] text-brand-muted px-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Instagram</a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Facebook</a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">TikTok</a>
            </div>
          </div>
        </aside>
      </header>
    </>
  );
}
