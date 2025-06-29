"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useSession, signOut } from "next-auth/react";
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Skeleton } from "./skeleton";
import { User, LogOut, ChevronDown, Loader2 } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);
  const { data: session, status } = useSession();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  const handleProfileNavigation = () => {
    setIsNavigatingToProfile(true);
    setTimeout(() => {
      setIsNavigatingToProfile(false);
    }, 3000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-6 sm:top-8 md:top-10 inset-x-0 mx-auto px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-between space-x-2 sm:space-x-3 md:space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {/* === Left and Center Section: Logo and Nav Items === */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/ravensec-logo.png"
              alt="RavenSec Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain"
            />
            <span className="text-white font-bold text-sm sm:text-base md:text-xl tracking-wide hidden md:block">
              <span className="text-red-500">Raven</span>Sec
            </span>
          </Link>

          <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {navItems.map((navItem, idx) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300 transition-colors duration-200"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="text-xs sm:text-sm !cursor-pointer whitespace-nowrap">
                  {navItem.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: Dynamic Auth UI */}
        <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          {status === "loading" && (
            <Skeleton className="h-10 w-24 bg-white/10" />
          )}

          {status === "unauthenticated" && (
            <>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-xs sm:text-sm h-9 px-3">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm h-9 px-3">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}

          {status === "authenticated" && session.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-auto rounded-full px-3 hover:bg-white/10 focus:ring-2 focus:ring-white/20 focus:ring-offset-0"
                  disabled={isSigningOut || isNavigatingToProfile}
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      {session.user.image ? (
                        <AvatarImage 
                          src={session.user.image} 
                          alt={session.user.name || "User Avatar"} 
                        />
                      ) : (
                        <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-white text-sm font-medium truncate max-w-[120px]">
                        {session.user.name || 'User'}
                      </span>
                      <span className="text-white/70 text-xs truncate max-w-[120px]">
                        {session.user.email}
                      </span>
                    </div>
                    {(isSigningOut || isNavigatingToProfile) ? (
                      <Loader2 className="h-4 w-4 text-white/70 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/70 hidden sm:block transition-transform duration-200" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                alignOffset={30}
                className="w-64 sm:w-72 bg-gradient-to-br from-[rgba(17,25,40,0.98)] to-[rgba(30,41,59,0.98)] border border-white/30 text-white shadow-2xl backdrop-blur-xl rounded-xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
                sideOffset={12}
                side="bottom"
              >
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-white/0">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
                        {session.user.image ? (
                          <AvatarImage 
                            src={session.user.image} 
                            alt={session.user.name || "User Avatar"} 
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-red-500/80 to-red-600/80 text-white font-bold text-lg shadow-lg">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate mb-1 leading-tight">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-white/60 truncate bg-white/10 rounded-full px-2 py-1 font-medium">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <DropdownMenuItem 
                    className={cn(
                      "group cursor-pointer mx-2 rounded-lg px-3 py-3 transition-all duration-200 ease-out",
                      "hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-lg hover:scale-[1.02]",
                      "focus:bg-gradient-to-r focus:from-white/10 focus:to-white/5 focus:outline-none focus:ring-2 focus:ring-white/20",
                      "border border-transparent hover:border-white/10",
                      isNavigatingToProfile && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent"
                    )}
                    disabled={isNavigatingToProfile || isSigningOut}
                    onClick={handleProfileNavigation}
                  >
                    <Link 
                      href="/profile" 
                      className="w-full flex items-center space-x-3"
                      onClick={handleProfileNavigation}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        isNavigatingToProfile 
                          ? "bg-blue-500/20" 
                          : "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
                      )}>
                        {isNavigatingToProfile ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        ) : (
                          <User className="h-4 w-4 text-white group-hover:text-blue-300 transition-colors duration-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white group-hover:text-blue-100 transition-colors duration-200">
                          {isNavigatingToProfile ? "Loading..." : "Manage account"}
                        </span>
                        <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-200">
                          Update your profile and settings
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gradient-to-r from-white/0 via-white/20 to-white/0 mx-4 my-2" />

                <div className="py-2 space-y-1">
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className={cn(
                      "group cursor-pointer mx-2 rounded-lg px-3 py-3 transition-all duration-200 ease-out",
                      "hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 hover:shadow-lg hover:scale-[1.02]",
                      "focus:bg-gradient-to-r focus:from-red-500/20 focus:to-red-600/10 focus:outline-none focus:ring-2 focus:ring-red-400/20",
                      "border border-transparent hover:border-red-400/20",
                      isSigningOut && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent"
                    )}
                    disabled={isSigningOut || isNavigatingToProfile}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        isSigningOut 
                          ? "bg-red-500/30" 
                          : "bg-red-500/20 group-hover:bg-red-500/30 group-hover:scale-110"
                      )}>
                        {isSigningOut ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-300" />
                        ) : (
                          <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors duration-200">
                          {isSigningOut ? "Signing out..." : "Sign out"}
                        </span>
                        <p className="text-xs text-red-400/60 group-hover:text-red-300/80 transition-colors duration-200">
                          End your current session
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                <div className="px-4 py-3 bg-gradient-to-r from-white/5 to-white/0 border-t border-white/10">
                  <p className="text-xs text-white/40 text-center font-medium">
                    Welcome, {session.user.name?.split(' ')[0] || 'User'}! 👋
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};