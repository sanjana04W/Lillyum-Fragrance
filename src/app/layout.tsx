import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { AuthProvider } from '@/context/AuthContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lillyumfragrance.lk'),
  title: {
    default: 'Lillyum Fragrance | Buy Authentic Perfumes Online Sri Lanka',
    template: '%s | Lillyum Fragrance Sri Lanka',
  },
  description:
    'Shop authentic imported perfumes online in Sri Lanka with Cash on Delivery. Wide range of EDP, EDT and Extrait fragrances from top brands. Fast island-wide delivery.',
  keywords: [
    'buy perfumes online Sri Lanka',
    'perfume shop Sri Lanka',
    'original perfumes Sri Lanka',
    'authentic perfumes online Sri Lanka',
    'Lillyum Fragrance Sri Lanka',
    'branded perfumes Sri Lanka',
    'COD perfumes Sri Lanka',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://lillyumfragrance.lk',
    siteName: 'Lillyum Fragrance',
    title: 'Lillyum Fragrance | Buy Authentic Perfumes Online Sri Lanka',
    description: 'Shop authentic imported perfumes online in Sri Lanka with Cash on Delivery.',
    images: [{ url: '/images/0f1335e388535d48b99c24c0e4894fc2.jpg', width: 1200, height: 630, alt: 'Lillyum Fragrance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lillyum Fragrance | Authentic Perfumes Online Sri Lanka',
    description: 'Shop authentic imported perfumes online in Sri Lanka with Cash on Delivery.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {},
};

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-brand-cream text-brand-charcoal">
        <AuthProvider>
          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'OnlineStore',
                name: 'Lillyum Fragrance',
                url: 'https://lillyumfragrance.lk',
                logo: 'https://lillyumfragrance.lk/logo.png',
                telephone: '+94752369613',
                email: 'lillyumfragrance@gmail.com',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Colombo',
                  postalCode: '01200',
                  addressCountry: 'LK',
                },
                sameAs: [
                  'https://www.facebook.com/share/1CU55pATL3/',
                  'https://www.instagram.com/lillyum_fragrance',
                  'https://www.tiktok.com/@lilyumfragrance',
                ],
              }),
            }}
          />

          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-right" />
        </AuthProvider>

        {/* Meta Pixel — loaded after hydration */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* TikTok Pixel — lazy loaded */}
        {TIKTOK_PIXEL_ID && (
          <Script id="tiktok-pixel" strategy="lazyOnload">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}

