'use client';
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './navlinks';
import { 
  UserCircleIcon, 
  HomeIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const getUserInitials = (name: string | null | undefined, email: string | null | undefined): string => {
  if (name) {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }
  
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

const getAvatarColor = (initials: string): string => {
  const colors = [
    'from-red-500 to-red-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600',
  ];
  
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function SideNav() {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  const handleLogoClick = () => {
    setIsLogoLoading(true);
    setTimeout(() => setIsLogoLoading(false), 2000);
  };

  return (
    <div className="flex h-full flex-col bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 shadow-2xl">
      <Link
        className="group mb-6 flex h-20 items-center justify-start px-6 py-4 transition-all duration-300 hover:bg-red-950/30"
        href="/"
        onClick={handleLogoClick}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 relative">
            {isLogoLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : (
              <Image
                src="/ravensec-logo.png"
                alt="RavenSec Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white group-hover:text-red-100 transition-colors duration-300">
              RavenSec
            </h1>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              API Security Platform
            </p>
          </div>
        </div>
      </Link>

      <div className="flex-1 px-3">
        <nav className="space-y-2">
          <NavLinks />
        </nav>
      </div>

      <div className="px-3 pb-4">
        {status === "loading" && (
          <div className="mb-4 rounded-lg bg-gray-800/50 p-4 border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700/50" />
              <div className="hidden md:block flex-1 space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-700/50" />
                <Skeleton className="h-3 w-32 bg-gray-700/50" />
              </div>
            </div>
          </div>
        )}

        {status === "authenticated" && session?.user && (
          <>
            <div className="mb-4 rounded-lg bg-gray-800/50 p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${getAvatarColor(getUserInitials(session.user.name, session.user.email))} flex items-center justify-center ring-2 ring-red-500/20 shadow-lg`}>
                    <span className="text-white font-bold text-sm select-none">
                      {getUserInitials(session.user.name, session.user.email)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user.email || 'Security Analyst'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">    
              <button 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="group flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-red-600/10 p-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-600/20 hover:text-red-300 border border-red-600/20 hover:border-red-600/40 md:justify-start disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSigningOut ? (
                  <>
                    <span className="hidden md:block">Signing out</span>
                    <Loader2 className="h-5 w-5 animate-spin text-red-400 group-hover:text-red-300" />
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span className="hidden md:block">Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {status === "unauthenticated" && (
          <div className="space-y-2">
            <Link 
              href="/sign-in"
              className="group flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-blue-600/10 p-3 text-sm font-medium text-blue-400 transition-all duration-200 hover:bg-blue-600/20 hover:text-blue-300 border border-blue-600/20 hover:border-blue-600/40 md:justify-start"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
              <span className="hidden md:block">Sign In</span>
            </Link>
            
            <Link 
              href="/sign-up"
              className="group flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-red-600 p-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 border border-red-600 hover:border-red-700 md:justify-start"
            >
              <UserCircleIcon className="h-5 w-5 text-white transition-colors duration-200" />
              <span className="hidden md:block">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}