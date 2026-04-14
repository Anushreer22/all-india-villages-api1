import { Download, FileSpreadsheet, FileJson } from 'lucide-react';
import { useState } from 'react';

export default function ExportButton({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  const exportAsCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = ['Village Name', 'Sub-District', 'District', 'State', 'Village Code'];
    const rows = data.map(v => [
      v.village_name || '',
      v.subdistrict_name || '',
      v.district_name || '',
      v.state_name || '',
      v.village_code || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `villages_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportAsJSON = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `villages_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={exportAsCSV}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            CSV Format
          </button>
          <button
            onClick={exportAsJSON}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"
          >
            <FileJson className="w-4 h-4 text-yellow-600" />
            JSON Format
          </button>
        </div>
      )}
    </div>
  );
}