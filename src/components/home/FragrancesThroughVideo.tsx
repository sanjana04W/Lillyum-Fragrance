'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoProduct {
  id: string;
  title: string;
  brand: string;
  price: number;
  size: number;
  image: string;
  slug: string;
  sku: string;
  videoSrc?: string;
  badge: string;
}

const VIDEO_PRODUCTS: VideoProduct[] = [
  {
    id: 'prod-001',
    title: 'Club de Nuit Intense Man',
    brand: 'Armaf',
    price: 5800,
    size: 105,
    image: '/images/video_card_1.jpg',
    videoSrc: '/videos/card_1.mp4',
    slug: 'armaf-club-de-nuit-intense-man-edp-105ml',
    sku: 'ARM-CDNI-105',
    badge: 'Floral Symphony',
  },
  {
    id: 'prod-002',
    title: 'Oud For Glory',
    brand: 'Lattafa',
    price: 7200,
    size: 100,
    image: '/images/video_card_2.jpg',
    videoSrc: '/videos/card_2.mp4',
    slug: 'lattafa-oud-for-glory-edp-100ml',
    sku: 'LAT-OFG-100',
    badge: 'Mystic Night',
  },
  {
    id: 'prod-004',
    title: 'Khamrah',
    brand: 'Lattafa',
    price: 8500,
    size: 100,
    image: '/images/video_card_3.jpg',
    videoSrc: '/videos/card_3.mp4',
    slug: 'lattafa-khamrah-edp-100ml',
    sku: 'LAT-KHM-100',
    badge: 'Desert Amber',
  },
  {
    id: 'prod-003',
    title: 'Hawas for Men',
    brand: 'Rasasi',
    price: 4800,
    size: 100,
    image: '/images/video_card_4.jpg',
    videoSrc: '/videos/card_4.mp4',
    slug: 'rasasi-hawas-for-men-edt-100ml',
    sku: 'RAS-HAW-100',
    badge: 'Lavande Royale',
  },
];

// Each card has its own videoRef so play() fires imperatively after mount
function VideoCard({ prod }: { prod: VideoProduct }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    const p = vid.play();
    if (p !== undefined) p.catch(() => {});
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  return (
    <div className="group block relative rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 bg-brand-white border border-brand-light select-none">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-brand-ivory">
        {prod.videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={prod.videoSrc}
              poster={prod.image}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </>
        ) : (
          <>
            <Image
              src={prod.image}
              alt={`${prod.brand} ${prod.title}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </>
        )}

        {prod.videoSrc && (
          <button
            onClick={toggleMute}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-brand-charcoal/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-gold transition-colors"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}

        <div className="absolute top-3.5 left-3.5 z-20">
          <span className="inline-block bg-brand-charcoal/60 backdrop-blur-md text-brand-gold-lighter text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full border border-white/10">
            {prod.badge}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FragrancesThroughVideo() {
  return (
    <section className="py-14 sm:py-18 bg-brand-cream">
      <div className="container-padded">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Visual Showcase</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Fragrances Through Video
          </h2>
          <p className="text-brand-mid text-sm mt-2 max-w-lg mx-auto">
            Experience the mood, craftsmanship, and essence of our most iconic scents in dynamic motion.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {VIDEO_PRODUCTS.map((prod) => (
            <VideoCard key={prod.id} prod={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
