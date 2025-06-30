'use client';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview & Analytics'
  },
  {
    name: 'Endpoints',
    href: '/dashboard/endpoints',
    icon: DocumentDuplicateIcon,
    description: 'API Route Monitoring'
  },
  {
    name: 'Security Alerts',
    href: '/dashboard/alerts',
    icon: ExclamationTriangleIcon,
    description: 'Risk Notifications'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: ChartBarIcon,
    description: 'Security Reports'
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'group relative flex h-12 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 md:justify-start',
              {
                'bg-red-600/20 text-red-400 border border-red-600/30 shadow-lg shadow-red-600/10': isActive,
                'text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-gray-700/50': !isActive,
              },
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-red-500"></div>
            )}
            
            <LinkIcon className={clsx(
              'h-5 w-5 transition-all duration-200',
              {
                'text-red-400': isActive,
                'text-gray-400 group-hover:text-gray-300': !isActive,
              }
            )} />
            
            <div className="hidden md:block flex-1 min-w-0">
              <p className={clsx(
                'truncate transition-colors duration-200',
                {
                  'text-red-400': isActive,
                  'text-gray-300 group-hover:text-white': !isActive,
                }
              )}>
                {link.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {link.description}
              </p>
            </div>

            <div className={clsx(
              'absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/5 to-transparent opacity-0 transition-opacity duration-300',
              {
                'opacity-100': isActive,
                'group-hover:opacity-50': !isActive,
              }
            )}></div>
          </Link>
        );
      })}
    </>
  );
}