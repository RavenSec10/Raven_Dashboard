"use client";
import React, { Suspense, lazy, useState } from 'react'
import { Spotlight } from './ui/Spotlight';
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { FaLocationArrow } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const BackgroundBeams = lazy(() => import('./ui/BackgroundBeams').then(module => ({ default: module.BackgroundBeams })));

const Hero = () => {
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);
  const router = useRouter();

  const handleGetStartedClick = () => {
    setIsNavigatingToDashboard(true);
    router.push('/dashboard');
    setTimeout(() => {
      setIsNavigatingToDashboard(false);
    }, 3000);
  };

  return (
    <div className='pb-20 pt-36 relative'>
        <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="red"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="red" />
        <Spotlight
          className="-top-10 -right-10 h-[70vh] w-[45vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-10 -left-10 h-[60vh] w-[40vw]"
          fill="red"
        />
        <Spotlight
          className="top-1/4 right-1/4 h-[50vh] w-[35vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-1/4 left-1/4 h-[45vh] w-[30vw]"
          fill="red"
        />
        <Spotlight
          className="-bottom-5 right-1/4 h-[55vh] w-[38vw]"
          fill="white"
        />
        <Spotlight
          className="top-1/2 -left-20 h-[65vh] w-[42vw]"
          fill="red"
        />
        <Spotlight
          className="top-20 right-1/2 h-[48vh] w-[32vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-1/3 right-1/3 h-[52vh] w-[36vw]"
          fill="red"
        />
        <Spotlight
          className="-top-5 left-1/2 h-[58vh] w-[40vw]"
          fill="white"
        />
        <Spotlight
          className="top-1/3 left-1/4 h-[40vh] w-[25vw]"
          fill="red"
        />
        <Spotlight
          className="bottom-1/2 right-1/2 h-[35vh] w-[28vw]"
          fill="white"
        />
      </div>

      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />}>
        <BackgroundBeams className="z-0" />
      </Suspense>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xl text-center text-blue-100 max-w-80">
            Welcome to RavenSec
          </p>
          <TextGenerateEffect
            words="The Raven Sees What Others Miss. Protects What Others Can't."
            className="text-center text-[30px] md:text-3xl lg:text-4xl xl:text-5xl font-bold"
          />
            <br />
          <p className="text-center md:tracking-wider mb-4 text-xs md:text-sm lg:text-base max-w-4xl">
            Inspect API traffic to comprehensively map all endpoints and routes, classify data types and payload structures, verify authentication mechanisms and authorization controls, detect sensitive information exposure, and identify potential security vulnerabilities across your API infrastructure.
          </p>

          <div 
            onClick={isNavigatingToDashboard ? undefined : handleGetStartedClick}
            className={cn(
              "transition-all duration-200",
              isNavigatingToDashboard 
                ? "opacity-70 cursor-not-allowed" 
                : "cursor-pointer hover:scale-105"
            )}
          >
            <MagicButton
              title={isNavigatingToDashboard ? "Loading..." : "Get Started"}
              icon={
                isNavigatingToDashboard ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FaLocationArrow />
                )
              }
              position="right"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero