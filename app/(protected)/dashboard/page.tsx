import { lusitana } from '@/components/ui/fonts';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  LockClosedIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Endpoints',
    value: '47',
    change: '+12%',
    changeType: 'positive',
    icon: ChartBarIcon,
  },
  {
    name: 'High Risk Detected',
    value: '8',
    change: '+2',
    changeType: 'negative',
    icon: ExclamationTriangleIcon,
  },
  {
    name: 'Protected Routes',
    value: '32',
    change: '+5%',
    changeType: 'positive',
    icon: LockClosedIcon,
  },
  {
    name: 'Data Types Found',
    value: '156',
    change: '+23%',
    changeType: 'positive',
    icon: EyeIcon,
  },
];

const recentActivity = [
  {
    id: 1,
    endpoint: '/api/user/profile',
    risk: 'HIGH',
    dataType: 'PAN_CARD, FULL_NAME',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    endpoint: '/api/health/claim',
    risk: 'HIGH',
    dataType: 'US_MEDICARE',
    timestamp: '5 minutes ago',
  },
  {
    id: 3,
    endpoint: '/api/finance/tax',
    risk: 'HIGH',
    dataType: 'UK_NINO',
    timestamp: '8 minutes ago',
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent"></div>
        <div className="relative px-6 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20">
                    <ShieldCheckIcon className="mr-2 h-4 w-4" />
                    API Security Monitoring
                  </div>
                  
                  <h1 className={`${lusitana.className} text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl`}>
                    <span className="block">The Raven</span>
                    <span className="block text-red-400">Sees What Others Miss.</span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Inspect API traffic to comprehensively map all endpoints and routes, classify data types and payload structures, 
                    verify authentication mechanisms and authorization controls, detect sensitive information exposure, 
                    and identify potential security vulnerabilities across your API infrastructure.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/endpoints" className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-red-500 hover:bg-red-500 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                    <EyeIcon className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">View Endpoints</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                   </Link>
                  <button className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600 cursor-pointer">
                    <ChartBarIcon className="mr-2 h-5 w-5" />
                    View Analytics
                  </button>
                </div>
              </div>
              
              <div className="relative lg:ml-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative">
                  <Image
                    src="/dash.png"
                    width={1000}
                    height={760}
                    className="rounded-2xl shadow-2xl ring-1 ring-white/10"
                    alt="RavenSec dashboard showing API endpoint monitoring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg ring-1 ring-white/10 hover:ring-red-500/50 transition-all duration-300 hover:shadow-red-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <stat.icon className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    <ArrowTrendingUpIcon className={`mr-1 h-3 w-3 ${
                      stat.changeType === 'negative' ? 'rotate-180' : ''
                    }`} />
                    {stat.change}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="px-6 pb-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-lg ring-1 ring-white/10">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Recent High-Risk Detections</h3>
              <p className="text-sm text-gray-400">Latest endpoints with sensitive data exposure</p>
            </div>
            <div className="divide-y divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-700/30 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-red-500/10 p-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.endpoint}</p>
                        <p className="text-xs text-gray-400">{activity.dataType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
                        {activity.risk}
                      </span>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-700">
              <Link href="/dashboard/endpoints" className="w-full text-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer">
                View all detections →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}