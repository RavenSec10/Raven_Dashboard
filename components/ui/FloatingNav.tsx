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
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Skeleton } from "./skeleton";

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
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                    <AvatarFallback className="bg-white/20">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[rgba(17,25,40,0.9)] border-white/20 text-white">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/profile" className="w-full block">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};