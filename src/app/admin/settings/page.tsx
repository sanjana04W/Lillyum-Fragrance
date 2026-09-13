'use client';

import { useState } from 'react';
import { SOCIAL_LINKS, STORE_PHONE, STORE_EMAIL, STORE_ADDRESS } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [metaPixel, setMetaPixel] = useState('');
  const [tiktokPixel, setTiktokPixel] = useState('');
  const [emailjsService, setEmailjsService] = useState('');
  const [emailjsTemplate, setEmailjsTemplate] = useState('');
  const [emailjsKey, setEmailjsKey] = useState('');

  const handleSave = () => {
    toast.success('Settings saved! Update your .env.local file with these values and redeploy.');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-white">Settings</h1>
        <p className="text-brand-muted text-xs">System configuration — Owner access only</p>
      </div>

      {/* Pixel Settings */}
      <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
        <h2 className="text-brand-white font-semibold text-sm">Marketing Pixels</h2>
        <Input label="Meta Pixel ID" value={metaPixel} onChange={(e) => setMetaPixel(e.target.value)} placeholder="Your Meta Pixel ID" hint="Found in Meta Business Manager → Events Manager" />
        <Input label="TikTok Pixel ID" value={tiktokPixel} onChange={(e) => setTiktokPixel(e.target.value)} placeholder="Your TikTok Pixel ID" hint="Found in TikTok Ads Manager → Events" />
      </div>

      {/* EmailJS Settings */}
      <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
        <h2 className="text-brand-white font-semibold text-sm">Email Configuration (EmailJS)</h2>
        <p className="text-brand-muted text-xs">Create a free account at <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">emailjs.com</a> to set up order confirmation emails.</p>
        <Input label="Service ID" value={emailjsService} onChange={(e) => setEmailjsService(e.target.value)} placeholder="service_xxxxxxx" />
        <Input label="Customer Template ID" value={emailjsTemplate} onChange={(e) => setEmailjsTemplate(e.target.value)} placeholder="template_xxxxxxx" />
        <Input label="Public Key" value={emailjsKey} onChange={(e) => setEmailjsKey(e.target.value)} placeholder="your_public_key" />
      </div>

      {/* Business Info */}
      <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-3">
        <h2 className="text-brand-white font-semibold text-sm">Business Information</h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-brand-muted">Phone</span><span className="text-brand-white">{STORE_PHONE}</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Email</span><span className="text-brand-white">{STORE_EMAIL}</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Address</span><span className="text-brand-white">{STORE_ADDRESS}</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Instagram</span><span className="text-brand-gold">@lillyum_fragrance</span></div>
          <div className="flex justify-between"><span className="text-brand-muted">Facebook</span><span className="text-brand-gold">4.8K followers</span></div>
        </div>
        <p className="text-brand-muted text-xs mt-3">To update business info, edit <code className="text-brand-gold">src/lib/constants.ts</code></p>
      </div>

      <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-4 text-xs text-brand-muted">
        <p className="text-brand-gold font-semibold mb-1">⚠ Important</p>
        <p>Pixel IDs and EmailJS keys must also be updated in <code>.env.local</code> file and the app redeployed for changes to take effect in production.</p>
      </div>

      <Button variant="primary" onClick={handleSave}>Save Settings</Button>
    </div>
  );
}

