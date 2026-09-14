import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import EditableSection from './cms/EditableSection';
import brandLogo from '../assets/logo.png';

export default function Footer() {
  const { navigateTo, siteContent } = useShop();
  const f = siteContent?.footer_content || {};
  const c = siteContent?.contact_info || {};
  const brandName = f.brand_name || 'NOOR AL DHUHA';
  const copyright = f.copyright || '© 2024 NOOR AL DHUHA. ALL RIGHTS RESERVED.';
  const mapsUrl = c.maps_url || 'https://share.google/vAGosfCcVD1W0HmtO';

  return (
    <EditableSection cmsKey="footer_content" label="Footer">
      <footer className="w-full bg-[#68043D] text-white border-t border-white/20 pt-14 pb-28 lg:py-16 mt-auto shadow-2xl font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          {/* Brand & Copyright (Left) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('home')}
              className="focus:outline-none shrink-0 group cursor-pointer"
              aria-label="NOOR AL DHUHA Home"
            >
              <img
                src={brandLogo}
                alt="NOOR AL DHUHA Logo"
                className="h-12 sm:h-14 w-auto object-contain brightness-200 transition-transform duration-300 group-hover:scale-105"
              />
            </button>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('home')}
                className="text-lg sm:text-xl tracking-[0.16em] font-bold text-white uppercase text-left hover:text-white/80 transition-colors block leading-tight cursor-pointer"
              >
                {brandName}
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] tracking-wide text-white/90 hover:text-white transition-colors font-medium group/map"
                title="View on Google Maps"
              >
                <MapPin className="w-3 h-3 text-rose-300 shrink-0 group-hover/map:scale-110 transition-transform" />
                <span>Dubai, United Arab Emirates</span>
              </a>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-white/70 font-medium">
                {copyright}
              </p>
            </div>
          </div>

          {/* Navigation Links (Right) */}
          <div className="flex flex-wrap sm:items-center gap-4 sm:gap-6 lg:gap-8 text-xs uppercase tracking-[0.06em] text-white">
            <button onClick={() => navigateTo('terms')} className="hover:text-white text-left transition-colors font-bold cursor-pointer">
              Terms & Privacy
            </button>
            <button onClick={() => navigateTo('refund-policy')} className="hover:text-white text-left transition-colors font-bold cursor-pointer">
              Shipping & Returns
            </button>
            <button onClick={() => navigateTo('offers')} className="hover:text-white text-left transition-colors font-bold cursor-pointer">
              Atelier Privileges
            </button>
            <button onClick={() => navigateTo('story')} className="hover:text-white text-left transition-colors font-bold cursor-pointer">
              Our Story
            </button>
            <button onClick={() => navigateTo('contact')} className="hover:text-white text-left transition-colors font-bold cursor-pointer">
              Concierge & Contact
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-1.5 text-white hover:bg-white hover:text-[#7A0648] transition-colors font-bold cursor-pointer px-3 py-1.5 border border-white/40 text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Admin Portal</span>
            </button>
          </div>

        </div>
      </footer>
    </EditableSection>
  );
}
