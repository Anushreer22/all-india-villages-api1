import { Database, MapPin, Zap, TrendingUp, Activity, Key } from 'lucide-react';

const stats = [
  { 
    label: 'Total Villages', 
    value: '600,000+', 
    icon: Database, 
    color: 'from-blue-500 to-cyan-500',
    change: '+12.5%',
    trend: 'up'
  },
  { 
    label: 'States & UTs', 
    value: '36', 
    icon: MapPin, 
    color: 'from-green-500 to-emerald-500',
    change: 'All',
    trend: 'stable'
  },
  { 
    label: 'Avg Response Time', 
    value: '<100ms', 
    icon: Zap, 
    color: 'from-yellow-500 to-orange-500',
    change: '-23%',
    trend: 'up'
  },
  { 
    label: 'API Requests Today', 
    value: '1,234', 
    icon: Activity, 
    color: 'from-purple-500 to-pink-500',
    change: '+18%',
    trend: 'up'
  },
  { 
    label: 'Active Users', 
    value: '89', 
    icon: TrendingUp, 
    color: 'from-red-500 to-rose-500',
    change: '+5',
    trend: 'up'
  },
  { 
    label: 'API Keys Active', 
    value: '24', 
    icon: Key, 
    color: 'from-indigo-500 to-violet-500',
    change: '+3',
    trend: 'up'
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg text-white`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              stat.trend === 'up' ? 'bg-green-100 text-green-700' :
              stat.trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}