import React from 'react';
import { ShieldCheck, RotateCcw, HelpCircle, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function RefundPolicyPage() {
  const { navigateTo } = useShop();

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-8 sm:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in text-[#1E141B] font-sans font-semibold">
      
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#7A0648] hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      <div className="space-y-2">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#7A0648]">
          Atelier Assurance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1E141B] font-bold tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          Last updated: August 2026. Designed with transparency and client satisfaction at its core.
        </p>
      </div>

      <div className="bg-white rounded-none border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-stone-700 font-medium">
        
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1E141B]">
            1. 14-Day Complimentary Returns & Exchanges
          </h2>
          <p>
            We take immense pride in the craftsmanship of every Grade 6A pure mulberry silk and Japanese georgette garment. If you are not completely enchanted with your purchase, you may initiate a return or exchange within 14 calendar days from the date of delivery.
          </p>
          <p>
            Items must be in their original, unwashed, unworn condition with all atelier tags, packaging, and the security seal intact.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1E141B]">
            2. Order Cancellation Window
          </h2>
          <p>
            Orders can be cancelled free of charge within <strong>4 hours</strong> of placement before the garment enters handcrafting, quality inspection, and packaging at our atelier. Once dispatched, standard return procedures apply upon delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1E141B]">
            3. Processing Your Refund
          </h2>
          <p>
            Upon receipt and inspection of returned items at our global logistics center, your refund will be processed within <strong>3-5 business days</strong> to the original payment method (Credit/Debit Card, UPI, PayPal, or Apple Pay).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-[#1E141B]">
            4. Dedicated Concierge Assistance
          </h2>
          <p>
            For any queries regarding returns, exchange size adjustments, or bespoke alterations, contact our concierge directly at{' '}
            <a href="mailto:nooraldhuhallc@gmail.com" className="text-[#7A0648] hover:underline font-bold">
              nooraldhuhallc@gmail.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
