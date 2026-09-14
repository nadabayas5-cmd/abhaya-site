import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import EditableSection from '../components/cms/EditableSection';

export default function ContactPage() {
  const { showToast, siteContent } = useShop();
  const c = siteContent?.contact_info || {};

  const phone = c.phone || '+971 56 159 9436';
  const phoneFallback = c.phone_fallback || '+971 55 737 0080';
  const whatsappUrl = c.whatsapp_url || 'https://wa.me/971561599436';
  const whatsappFallbackUrl = c.whatsapp_fallback_url || 'https://wa.me/971557370080';
  const email = c.email || 'atelier@nooraldhuha.com';
  const address = c.address || 'Noor Al Dhuha Clothes Trading LLC, Dubai, United Arab Emirates';
  const mapsUrl = c.maps_url || 'https://share.google/vAGosfCcVD1W0HmtO';
  const hours = c.hours || 'Mon – Sat, 9:00 AM – 8:00 PM GST';
  const faqs = Array.isArray(c.faqs) && c.faqs.length > 0 ? c.faqs : [
    { q: 'What is Grade 6A Mulberry Silk and why is it superior?', a: 'Grade 6A represents the pinnacle of raw silk quality...' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Order / Custom Sizing',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);


  const handleSubmit = (e) => {

    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry sent to NOOR AL DHUHA Atelier Concierge.');
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Bespoke Order / Custom Sizing',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-8 sm:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in text-[#1E141B] font-semibold">
      <EditableSection cmsKey="contact_info" label="Contact & FAQs">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-[#F5EAF1] border border-[#7A0648]/30 text-xs font-sans font-bold uppercase tracking-widest text-[#7A0648]">
          <Sparkles className="w-3.5 h-3.5 text-[#7A0648]" />
          <span>Atelier Client Care</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E141B] font-bold tracking-tight">
          Connect With Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto leading-relaxed">
          Whether you need bespoke styling guidance, custom sizing assistance, or corporate gifting inquiries, our concierge is at your service.
        </p>
      </div>

      {/* Grid: Direct Contact Channels & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contact Info & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-none border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#1E141B]">
              Direct Inquiries
            </h2>

            <div className="space-y-5 text-xs sm:text-sm font-sans text-[#1E141B]">
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#F5EAF1] text-[#7A0648] shrink-0 border border-[#7A0648]/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-[#1E141B]">Concierge Hotline & WhatsApp</span>
                  <div className="space-y-0.5 mt-0.5">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#7A0648] hover:underline block font-bold">
                      {phone} <span className="text-[10px] text-stone-500 font-normal">(Primary)</span>
                    </a>
                    {phoneFallback && (
                      <a href={whatsappFallbackUrl} target="_blank" rel="noopener noreferrer" className="text-[#7A0648] hover:underline block font-bold">
                        {phoneFallback} <span className="text-[10px] text-stone-500 font-normal">(Fallback / Line 2)</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium block mt-1">{hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#F5EAF1] text-[#7A0648] shrink-0 border border-[#7A0648]/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-[#1E141B]">Editorial & Client Services</span>
                  <a href={`mailto:${email}`} className="text-[#7A0648] hover:underline block mt-0.5 font-bold">
                    {email}
                  </a>
                  <span className="text-[11px] text-stone-500 font-medium">Guaranteed response within 4 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#F5EAF1] text-[#7A0648] shrink-0 border border-[#7A0648]/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-[#1E141B]">Flagship Atelier & Location</span>
                  <p className="text-stone-700 mt-0.5 leading-relaxed font-semibold">
                    {address}
                  </p>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#7A0648] hover:underline mt-2 pt-1 border-t border-stone-100"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Action Channels */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#7A0648] hover:bg-[#68043D] text-white text-[11px] font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Location</span>
              </a>
              <a
                href="https://www.instagram.com/nailberrie._/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 border border-stone-300 bg-stone-50 hover:bg-stone-100 text-[#1E141B] text-[11px] font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Instagram</span>
              </a>
            </div>

          </div>

          {/* Response SLA badge */}
          <div className="bg-white rounded-none border border-stone-200 p-5 flex items-center gap-4 text-xs font-sans text-[#1E141B] shadow-xs">
            <Clock className="w-5 h-5 text-[#7A0648] shrink-0" />
            <div>
              <span className="font-bold block">Priority VIP Inquiries</span>
              <p className="text-stone-600 text-[11px] font-medium">Orders and styling queries receive prompt attention from our resident modest couturiers.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-none border border-stone-200 p-6 sm:p-10 shadow-md">
            
            <h2 className="font-serif text-2xl font-bold text-[#1E141B] mb-2">
              Send a Message
            </h2>
            <p className="text-xs text-stone-600 font-medium mb-6 leading-relaxed">
              Fill out the form below and our styling team will be in touch shortly.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-none p-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">
                  Thank You, Message Received
                </h3>
                <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
                  Our atelier concierge has received your note and will get back to you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Al-Mansoor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-none py-3 px-4 text-sm font-sans text-[#1E141B] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0648] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-none py-3 px-4 text-sm font-sans text-[#1E141B] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0648] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-none py-3 px-4 text-sm font-sans text-[#1E141B] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0648] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-none py-3 px-4 text-sm font-sans text-[#1E141B] focus:outline-none focus:border-[#7A0648] transition-all cursor-pointer font-medium"
                    >
                      <option value="Bespoke Order / Custom Sizing">Bespoke Order / Custom Sizing</option>
                      <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                      <option value="Fabric & Care Questions">Fabric & Care Questions</option>
                      <option value="Bridal & Event Capsule">Bridal & Event Capsule</option>
                      <option value="Press & Collaboration">Press & Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Your Message / Styling Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can assist you with your modest couture wardrobe..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-none py-3 px-4 text-sm font-sans text-[#1E141B] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0648] transition-all resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#7A0648] hover:bg-[#68043D] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-[#7A0648]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1E141B] font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-600 font-medium">
            Quick answers regarding our fabrics, sizing, and international fulfillment
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 bg-white overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
              >
                <span className="font-serif text-base font-bold text-[#1E141B]">
                  {faq.q}
                </span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#7A0648] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm font-sans text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </EditableSection>

    </div>
  );
}
