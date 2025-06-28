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
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

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

        {/* === Right Section: Dynamic Auth UI === */}
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
                <Button variant="ghost" className="relative h-10 w-auto rounded-full px-3 hover:bg-white/10 focus:ring-2 focus:ring-white/20 focus:ring-offset-0">
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
                    <ChevronDown className="h-4 w-4 text-white/70 hidden sm:block transition-transform duration-200" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                alignOffset={30}
                className="w-56 sm:w-64 bg-[rgba(17,25,40,0.95)] border border-white/20 text-white shadow-xl backdrop-blur-md rounded-lg overflow-hidden"
                sideOffset={12}
                side="bottom"
              >
                {/* User Info Header */}
                <div className="px-3 py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {session.user.image ? (
                        <AvatarImage 
                          src={session.user.image} 
                          alt={session.user.name || "User Avatar"} 
                        />
                      ) : (
                        <AvatarFallback className="bg-white/20 text-white font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors px-3 py-2">
                    <Link href="/profile" className="w-full flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Manage account</span>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/10" />

                <div className="py-1">
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: "/" })} 
                    className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors px-3 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};