import { useState, useRef } from 'react';
import { Search, Loader2, X, AlertCircle } from 'lucide-react';
import { searchVillages } from '../services/api';

export default function SearchBar({ onSearch, query, setQuery, loading }) {
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleSearchClick = async () => {
    if (query.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    try {
      setError(null);
      const result = await searchVillages(query);
      onSearch(result.data);
    } catch (err) {
      console.error(err);
      setError('Failed to search villages');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a village... (e.g., Agra)"
          className="w-full px-5 py-4 pl-12 pr-12 text-lg bg-white border-2 border-gray-200 rounded-2xl"
        />

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSearchClick}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Search
        </button>
      </div>
    </div>
  );
}