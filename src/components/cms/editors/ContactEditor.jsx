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

      <Field label="Phone Number">
        <Input value={value.phone} onChange={v => set('phone', v)} placeholder="+971 56 701 3083" />
      </Field>

      <Field label="WhatsApp URL" hint="Full wa.me link, e.g. https://wa.me/971567013083">
        <Input value={value.whatsapp_url} onChange={v => set('whatsapp_url', v)} placeholder="https://wa.me/971..." />
      </Field>

      <Field label="Email Address">
        <Input type="email" value={value.email} onChange={v => set('email', v)} placeholder="atelier@nooraldhuha.com" />
      </Field>

      <Field label="Physical Address">
        <Textarea value={value.address} onChange={v => set('address', v)} rows={2} placeholder="NOOR AL DHUHA Atelier..." />
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
