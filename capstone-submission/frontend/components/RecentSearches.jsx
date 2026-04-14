import { Clock, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RecentSearches({ onSearch }) {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentVillageSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addSearch = (query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentVillageSearches', JSON.stringify(updated));
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentVillageSearches');
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Recent Searches</span>
        </div>
        <button onClick={clearSearches} className="text-xs text-gray-400 hover:text-red-500 transition">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, idx) => (
          <button
            key={idx}
            onClick={() => onSearch(search)}
            className="px-3 py-1 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-sm rounded-full transition"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}