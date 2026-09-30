import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-t border-b border-amber-200 py-3 px-4 text-xs text-amber-900">
      <div className="max-w-7xl mx-auto flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Legal & Clinical Notice:</strong> All information, articles, and doctor profiles provided on this portal are strictly for general educational guidance and healthcare facilitation. Content does not constitute clinical diagnosis, personalized drug prescriptions, or treatment guarantees. Always consult a qualified registered medical practitioner for any health conditions. In emergencies, immediately call <strong>1066</strong>.
        </p>
      </div>
    </div>
  );
}
