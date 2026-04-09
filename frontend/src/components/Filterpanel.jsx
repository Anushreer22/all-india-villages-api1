import { useState, useEffect } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { fetchStates, fetchDistrictsByState, fetchSubDistrictsByDistrict } from '../services/api';

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [loading, setLoading] = useState({ states: false, districts: false, subDistricts: false });

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    setLoading(prev => ({ ...prev, states: true }));
    try {
      const data = await fetchStates();
      setStates(data.data || []);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const loadDistricts = async (stateId) => {
    if (!stateId) {
      setDistricts([]);
      return;
    }
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const data = await fetchDistrictsByState(stateId);
      setDistricts(data.data || []);
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const loadSubDistricts = async (districtId) => {
    if (!districtId) {
      setSubDistricts([]);
      return;
    }
    setLoading(prev => ({ ...prev, subDistricts: true }));
    try {
      const data = await fetchSubDistrictsByDistrict(districtId);
      setSubDistricts(data.data || []);
    } catch (error) {
      console.error('Failed to load sub-districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, subDistricts: false }));
    }
  };

  const handleStateChange = (stateId) => {
    onFilterChange({ ...filters, stateId, districtId: '', subDistrictId: '' });
    loadDistricts(stateId);
    setSubDistricts([]);
  };

  const handleDistrictChange = (districtId) => {
    onFilterChange({ ...filters, districtId, subDistrictId: '' });
    loadSubDistricts(districtId);
  };

  const handleSubDistrictChange = (subDistrictId) => {
    onFilterChange({ ...filters, subDistrictId });
  };

  const activeFilterCount = [filters.stateId, filters.districtId, filters.subDistrictId].filter(Boolean).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filter by Location</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <select
                value={filters.stateId || ''}
                onChange={(e) => handleStateChange(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm"
                disabled={loading.states}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <select
                value={filters.districtId || ''}
                onChange={(e) => handleDistrictChange(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm"
                disabled={!filters.stateId || loading.districts}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            {/* Sub-District Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sub-District / Taluka</label>
              <select
                value={filters.subDistrictId || ''}
                onChange={(e) => handleSubDistrictChange(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 text-sm"
                disabled={!filters.districtId || loading.subDistricts}
              >
                <option value="">All Sub-Districts</option>
                {subDistricts.map(sd => (
                  <option key={sd.id} value={sd.id}>{sd.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}