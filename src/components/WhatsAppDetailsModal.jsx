import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Building2, Globe, FileText, MessageSquare, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  WHATSAPP_PHONE,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_FALLBACK_PHONE,
  WHATSAPP_FALLBACK_PHONE_DISPLAY,
  formatCartWhatsAppMessage,
  formatSingleProductWhatsAppMessage,
  openWhatsApp
} from '../utils/whatsapp';

const STORAGE_KEY = 'noor_customer_checkout_details';

export default function WhatsAppDetailsModal() {
  const {
    isWhatsAppModalOpen,
    closeWhatsAppModal,
    whatsAppModalPayload,
    userLocation,
    formatPrice,
    showToast
  } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    notes: '',
    selectedLine: 'primary' // 'primary' or 'fallback'
  });

  const [errors, setErrors] = useState({});

  // Load saved details from localStorage on mount or modal open
  useEffect(() => {
    if (isWhatsAppModalOpen) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        setFormData(prev => ({
          ...prev,
          name: parsed.name || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          city: parsed.city || (userLocation?.city || ''),
          country: parsed.country || (userLocation?.country || 'United Arab Emirates'),
          postalCode: parsed.postalCode || '',
          notes: parsed.notes || '',
          selectedLine: prev.selectedLine || 'primary'
        }));
      } catch {
        // ignore
      }
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWhatsAppModalOpen, userLocation]);

  if (!isWhatsAppModalOpen || !whatsAppModalPayload) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.phone.trim()) errs.phone = 'Please enter your contact/WhatsApp phone number';
    if (!formData.address.trim()) errs.address = 'Please enter your delivery street or villa address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmAndSend = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete required customer details.', 'error');
      return;
    }

    // Save to localStorage for seamless future orders
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          postalCode: formData.postalCode.trim(),
          notes: formData.notes.trim()
        })
      );
    } catch {
      // ignore
    }

    const customerDetails = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      postalCode: formData.postalCode.trim(),
      notes: formData.notes.trim()
    };

    let message = '';
    if (whatsAppModalPayload.type === 'single') {
      message = formatSingleProductWhatsAppMessage({
        ...whatsAppModalPayload.data,
        customerDetails
      });
    } else {
      // default is cart order
      message = formatCartWhatsAppMessage({
        ...whatsAppModalPayload.data,
        customerDetails
      });
    }

    const targetPhone = formData.selectedLine === 'fallback'
      ? WHATSAPP_FALLBACK_PHONE
      : WHATSAPP_PHONE;

    showToast('Redirecting to WhatsApp with your details...');
    openWhatsApp(message, targetPhone);
    closeWhatsAppModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] text-[#1E141B] rounded-none border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#68043D] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={closeWhatsAppModal}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 text-rose-200 text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/20">
            <Sparkles className="w-3 h-3 text-rose-300" />
            <span>Atelier WhatsApp Concierge</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            Delivery & Customer Details
          </h3>
          <p className="text-white/80 text-xs sm:text-sm font-medium mt-1 leading-snug">
            Your details will be prefilled into the WhatsApp order for fast atelier confirmation & dispatch.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmAndSend} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#7A0648]" />
              <span>Full Name <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Fatima Al Zahra"
              className={`w-full px-3 py-2.5 bg-white border ${errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'} text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm`}
            />
            {errors.name && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#7A0648]" />
              <span>Phone / WhatsApp Number <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="e.g. +971 50 123 4567"
              className={`w-full px-3 py-2.5 bg-white border ${errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'} text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm`}
            />
            {errors.phone && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{errors.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7A0648]" />
              <span>Street Address / Villa / Apartment <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="e.g. Villa 14, Al Wasl Road, Jumeirah"
              className={`w-full px-3 py-2.5 bg-white border ${errors.address ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'} text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm`}
            />
            {errors.address && <p className="text-rose-600 text-[10px] mt-1 font-semibold">{errors.address}</p>}
          </div>

          {/* City & Country Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#7A0648]" />
                <span>City / Emirate</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="e.g. Dubai / Abu Dhabi / Mumbai"
                className="w-full px-3 py-2.5 bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#7A0648]" />
                <span>Country / Region</span>
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={e => handleChange('country', e.target.value)}
                placeholder="e.g. United Arab Emirates"
                className="w-full px-3 py-2.5 bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Postal / PIN Code & Landmark (Optional) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
              Postal / PIN Code or Landmark <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              placeholder="e.g. Near City Center / 400001"
              className="w-full px-3 py-2 bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm"
            />
          </div>

          {/* Special Notes / Instructions */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7A0648]" />
              <span>Special Delivery or Atelier Notes <span className="text-stone-400 font-normal">(Optional)</span></span>
            </label>
            <textarea
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="e.g. Gift box packaging required, call upon arrival..."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 focus:outline-none focus:border-[#7A0648] focus:ring-1 focus:ring-[#7A0648] text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Preferred WhatsApp Concierge Line Selection */}
          <div className="pt-2 border-t border-stone-200">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-2">
              Send To WhatsApp Concierge Line:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('selectedLine', 'primary')}
                className={`p-2.5 text-left border transition-all flex items-center justify-between cursor-pointer ${formData.selectedLine === 'primary' ? 'border-[#7A0648] bg-[#F5EAF1] ring-1 ring-[#7A0648]' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
              >
                <div>
                  <span className="block text-[11px] font-bold text-[#1E141B]">Primary Line</span>
                  <span className="block text-[10px] text-stone-600">{WHATSAPP_PHONE_DISPLAY}</span>
                </div>
                {formData.selectedLine === 'primary' && <CheckCircle2 className="w-4 h-4 text-[#7A0648]" />}
              </button>

              <button
                type="button"
                onClick={() => handleChange('selectedLine', 'fallback')}
                className={`p-2.5 text-left border transition-all flex items-center justify-between cursor-pointer ${formData.selectedLine === 'fallback' ? 'border-[#7A0648] bg-[#F5EAF1] ring-1 ring-[#7A0648]' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
              >
                <div>
                  <span className="block text-[11px] font-bold text-[#1E141B]">Fallback Line 2</span>
                  <span className="block text-[10px] text-stone-600">{WHATSAPP_FALLBACK_PHONE_DISPLAY}</span>
                </div>
                {formData.selectedLine === 'fallback' && <CheckCircle2 className="w-4 h-4 text-[#7A0648]" />}
              </button>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 shrink-0 fill-current" />
              <span>Continue to WhatsApp with Prefilled Order</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <p className="text-center text-[10px] text-stone-500 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your details are stored securely on your device for fast future checkouts.</span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
