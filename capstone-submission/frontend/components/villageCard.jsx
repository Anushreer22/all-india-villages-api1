import { MapPin, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function VillageCard({ village }) {
  const [copied, setCopied] = useState(false);

  const copyFullAddress = () => {
    const address = `${village.village_name}, ${village.subdistrict_name}, ${village.district_name}, ${village.state_name}, India`;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
          <MapPin className="w-5 h-5 text-indigo-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-800 text-lg truncate">{village.village_name}</h3>
            <button
              onClick={copyFullAddress}
              className="text-gray-400 hover:text-indigo-600 transition flex-shrink-0"
              title="Copy full address"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 text-xs">🏢</span>
              <span className="text-gray-700">{village.subdistrict_name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">{village.district_name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 text-xs">📍</span>
              <span className="font-medium text-indigo-600">{village.state_name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
                Code: {village.village_code || 'N/A'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}