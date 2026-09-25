import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, ShieldCheck, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { WHATSAPP_PHONE } from '../utils/whatsapp';
import { rateLimiter } from '../lib/rateLimit';

export default function OrderLookupPage() {
  const { navigateTo, formatPrice, showToast } = useShop();

  const [orderNumber, setOrderNumber] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTrackingData, setActiveTrackingData] = useState(null);

  // Simulated lookup database
  const sampleOrder = {
    orderId: '#ABH-88421',
    placedDate: 'August 14, 2026',
    estimatedDelivery: 'August 18, 2026',
    status: 'In Transit via Express Courier',
    carrier: 'DHL Express Luxury Courier',
    trackingNumber: 'DHL-EX-994820194US',
    deliveryAddress: '742 Evergreen Terrace, Dubai & Worldwide Delivery',
    items: [
      {
        name: 'Midnight Espresso Silk Abaya',
        spec: 'Size 56 • Open Abaya Cut • Handwork Embroidery • 100% Mulberry Silk',
        price: 185,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1pd9NiCkfaDXafhb_-Uh3AA4XfN_AwnHEOOx0x2g2ngtcqCTGLjvTaBkKb-K-NzQCG24IEz1UecYCkOoBZQCz8Noq1fcMtAEZXyLpJZs8oZaOU9p5FhAShjG20FoGotY7Q5RtZ_fkUFk2HiRAkqY7a_y5R8pdolKPAtOtdjB3HFdhHKgY2Vfkv8U7Mfjej74-_slJxvP0a9gXoTwEPOLi7mSF52g0Nz5NZjvjyQzAgbD45y67GOUWkw'
      },
      {
        name: 'Royal Violet Mulberry Silk Abaya',
        spec: 'Size 56 • Butterfly / Farasha Cut • Stonework Craft',
        price: 210,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA'
      }
    ],
    timeline: [
      {
        title: 'Order Confirmed & Payment Verified',
        description: 'Payment authorized and receipt dispatched to your email.',
        time: 'Aug 14, 10:30 AM',
        completed: true,
        current: false
      },
      {
        title: 'Handcrafted at Atelier & Quality Inspected',
        description: 'Grade 6A Mulberry silk hand-hemmed with gold-thread verification.',
        time: 'Aug 15, 02:15 PM',
        completed: true,
        current: false
      },
      {
        title: 'Dispatched via Express Courier',
        description: 'Package handed over to DHL Luxury Express Hub (AWB #DHL-EX-994820194US).',
        time: 'Aug 16, 09:00 AM',
        completed: true,
        current: true
      },
      {
        title: 'Out for Local Courier Delivery',
        description: 'Your courier courier agent is scheduled for signature drop-off.',
        time: 'Estimated Aug 18',
        completed: false,
        current: false
      },
      {
        title: 'Delivered in Keepsake Box',
        description: 'Delivered safely with signature confirmation.',
        time: 'Pending',
        completed: false,
        current: false
      }
    ]
  };

  const handleLookup = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      showToast('Please enter your Order ID (e.g. #ABH-88421)', 'error');
      return;
    }

    const check = rateLimiter.check('order_lookup', { maxRequests: 5, windowMs: 60000 });
    if (!check.allowed) {
      showToast(`Rate limit reached. Please wait ${check.retryAfterSec}s before checking another order.`, 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
      setActiveTrackingData(sampleOrder);
      showToast('Order details located successfully.');
    }, 800);
  };

  const handleDemoFill = () => {
    setOrderNumber('#ABH-88421');
    setEmailOrPhone('patron@nooraldhuha.com');
  };

  return (
    <div className="min-h-screen bg-neutral-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-fade-in">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-sans font-bold uppercase tracking-widest text-primary">
          <Truck className="w-3.5 h-3.5 text-royal-violet" />
          <span>Real-Time Logistics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-primary/70 font-sans max-w-md mx-auto leading-relaxed">
          Enter your unique order identifier and email or phone number to review live atelier crafting status and dispatch timelines.
        </p>
      </div>

      {/* Lookup Card Form */}
      <div className="bg-white rounded-2xl border border-primary/15 p-6 sm:p-8 shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-primary/70 mb-2">
              Order ID / Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. #ABH-88421"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-surface-container/50 border border-primary/20 rounded-lg py-3 px-4 text-sm font-sans text-primary placeholder:text-primary/30 focus:outline-none focus:border-royal-violet focus:ring-1 focus:ring-royal-violet transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-primary/70 mb-2">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. patron@domain.com or +971 50 123 4567"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-surface-container/50 border border-primary/20 rounded-lg py-3 px-4 text-sm font-sans text-primary placeholder:text-primary/30 focus:outline-none focus:border-royal-violet focus:ring-1 focus:ring-royal-violet transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-6 bg-primary hover:bg-royal-violet text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Locating Atelier Package...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order Status</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDemoFill}
              className="py-3.5 px-4 border border-primary/20 bg-surface-container hover:bg-surface-container-highest text-primary text-xs font-sans font-medium rounded-lg transition-colors cursor-pointer"
            >
              Fill Demo ID
            </button>
          </div>
        </form>
      </div>

      {/* Live Order Tracking Result */}
      {searched && activeTrackingData && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Status Header Box */}
          <div className="bg-white rounded-2xl border border-primary/15 p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-primary/10">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-secondary">
                  Order Status
                </span>
                <h2 className="font-serif text-2xl font-medium text-primary flex items-center gap-2">
                  <span>{activeTrackingData.orderId}</span>
                  <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    {activeTrackingData.status}
                  </span>
                </h2>
                <p className="text-xs text-primary/60 font-sans mt-1">
                  Placed on {activeTrackingData.placedDate} • Estimated Delivery: <strong className="text-primary">{activeTrackingData.estimatedDelivery}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Carrier & AWB Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container/50 p-4 rounded-xl border border-primary/10 text-xs font-sans">
              <div>
                <span className="text-primary/50 uppercase tracking-wider block font-semibold text-[10px]">Courier Partner</span>
                <span className="font-medium text-primary">{activeTrackingData.carrier}</span>
              </div>
              <div>
                <span className="text-primary/50 uppercase tracking-wider block font-semibold text-[10px]">Tracking Number</span>
                <span className="font-mono font-bold text-primary">{activeTrackingData.trackingNumber}</span>
              </div>
              <div>
                <span className="text-primary/50 uppercase tracking-wider block font-semibold text-[10px]">Destination</span>
                <span className="font-medium text-primary truncate block">{activeTrackingData.deliveryAddress}</span>
              </div>
            </div>

            {/* 5-Step Visual Timeline */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif text-lg font-medium text-primary">
                Fulfillment & Logistics Progress
              </h3>

              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-primary/20">
                {activeTrackingData.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Circle icon */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.completed
                          ? 'bg-primary text-white shadow-sm ring-4 ring-primary/10'
                          : 'bg-white border-2 border-primary/30 text-primary/30'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-sans font-bold ${step.completed ? 'text-primary' : 'text-primary/50'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] font-sans text-primary/50">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-primary/70 font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Contents */}
            <div className="pt-6 border-t border-primary/10 space-y-4">
              <h3 className="font-serif text-lg font-medium text-primary">
                Creations in This Shipment
              </h3>
              <div className="space-y-3">
                {activeTrackingData.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-primary/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border border-primary/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-medium text-primary truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-primary/60 font-sans">
                        {item.spec}
                      </p>
                      <span className="text-xs font-sans font-semibold text-primary">
                        Qty: {item.quantity} • {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Help & Support Box */}
      <div className="bg-[#f4ede3] rounded-2xl border border-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif text-base font-medium text-primary">
            Need urgent assistance with your shipment?
          </h4>
          <p className="text-xs text-primary/70 font-sans">
            Our atelier concierge team is available 24/7 on WhatsApp & Email.
          </p>
        </div>
        <button
          onClick={() => navigateTo('contact')}
          className="px-5 py-2.5 bg-primary hover:bg-royal-violet text-white text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          Contact Concierge
        </button>
      </div>

    </div>
  );
}
