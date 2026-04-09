import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, AlertCircle } from 'lucide-react';
import { searchVillages, autocomplete } from '../services/api';

export default function SearchBar({ onSearch, query, setQuery, performSearch, loading }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Autocomplete on typing
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await autocomplete(query);
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete error:', err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (query.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    setError(null);
    performSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a village... (e.g., Manibeli, Akkalkuwa)"
            className="w-full px-5 py-4 pl-12 pr-12 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {query && (
            <button 
              onClick={clearSearch} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef} 
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fade-in"
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(s.label);
                  onSearch(s.label);
                  performSearch();
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-start gap-3 border-b border-gray-100 last:border-0 transition"
              >
                <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.fullAddress}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSearchClick}
          disabled={loading || query.length < 2}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {loading ? 'Searching...' : 'Search Villages'}
        </button>
      </div>
    </div>
  );
}