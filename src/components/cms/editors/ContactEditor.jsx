import React from 'react';
import { Field, Input, Textarea, SectionTitle, AddButton, RemoveButton, CardWrap } from './EditorFields';

/**
 * ContactEditor — Key: 'contact_info'
 */
export default function ContactEditor({ value, onChange }) {
  const set = (f, v) => onChange({ ...value, [f]: v });
  const faqs = Array.isArray(value.faqs) ? value.faqs : [];

  const updateFaq = (idx, field, val) =>
    set('faqs', faqs.map((faq, i) => i === idx ? { ...faq, [field]: val } : faq));
  const addFaq = () => set('faqs', [...faqs, { q: '', a: '' }]);
  const removeFaq = (idx) => { if (faqs.length > 1) set('faqs', faqs.filter((_, i) => i !== idx)); };

  return (
    <div className="space-y-5">
      <SectionTitle>Contact Information</SectionTitle>

      <Field label="Phone Number (Primary)">
        <Input value={value.phone} onChange={v => set('phone', v)} placeholder="+971 56 159 9436" />
      </Field>

      <Field label="Phone Number (Fallback / Line 2)">
        <Input value={value.phone_fallback} onChange={v => set('phone_fallback', v)} placeholder="+971 55 737 0080" />
      </Field>

      <Field label="WhatsApp URL (Primary)" hint="Full wa.me link, e.g. https://wa.me/971561599436">
        <Input value={value.whatsapp_url} onChange={v => set('whatsapp_url', v)} placeholder="https://wa.me/971..." />
      </Field>

      <Field label="WhatsApp URL (Fallback)" hint="Full wa.me link, e.g. https://wa.me/971557370080">
        <Input value={value.whatsapp_fallback_url} onChange={v => set('whatsapp_fallback_url', v)} placeholder="https://wa.me/971..." />
      </Field>

      <Field label="Email Address">
        <Input type="email" value={value.email} onChange={v => set('email', v)} placeholder="atelier@nooraldhuha.com" />
      </Field>

      <Field label="Physical Address">
        <Textarea value={value.address} onChange={v => set('address', v)} rows={2} placeholder="Noor Al Dhuha Clothes Trading LLC, Dubai, United Arab Emirates" />
      </Field>

      <Field label="Google Maps / Location URL" hint="Google Maps place or share link, e.g. https://share.google/vAGosfCcVD1W0HmtO">
        <Input value={value.maps_url} onChange={v => set('maps_url', v)} placeholder="https://share.google/vAGosfCcVD1W0HmtO" />
      </Field>

      <Field label="Business Hours">
        <Input value={value.hours} onChange={v => set('hours', v)} placeholder="Mon – Sat, 9:00 AM – 8:00 PM GST" />
      </Field>

      <SectionTitle>FAQ Section ({faqs.length} questions)</SectionTitle>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <CardWrap key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Q{idx + 1}</span>
              {faqs.length > 1 && <RemoveButton onClick={() => removeFaq(idx)} />}
            </div>
            <Field label="Question">
              <Input value={faq.q} onChange={v => updateFaq(idx, 'q', v)} placeholder="FAQ question..." />
            </Field>
            <Field label="Answer">
              <Textarea value={faq.a} onChange={v => updateFaq(idx, 'a', v)} rows={3} placeholder="FAQ answer..." />
            </Field>
          </CardWrap>
        ))}
        <AddButton onClick={addFaq} label="Add FAQ" />
      </div>
    </div>
  );
}
