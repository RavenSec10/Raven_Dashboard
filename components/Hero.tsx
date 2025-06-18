import React from 'react'
import { Spotlight } from './ui/Spotlight';
import { BackgroundBeams } from './ui/BackgroundBeams';
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { FaLocationArrow } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <div className='pb-20 pt-36'>
        <div className="absolute top-0 left-0 w-full z-20">
        <div className="flex items-center justify-start p-6">
          <div className="flex items-center space-x-3">
            {/* Logo - You can replace this with your actual logo */}
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">RavenSec</span>
          </div>
        </div>
        </div>
        <div>
            <Spotlight className="left-1 top-22 h-[20vh] w-[250vw]" fill="red" />
            <Spotlight className="left-10 top-22 h-[30vh] w-[250vw]" fill="red" />
            <Spotlight className="left-20 top-22 h-[40vh] w-[50vw]" fill="red" />
            <Spotlight className="left-40 top-22 h-[50vh] w-[50vw]" fill="red" />
            <Spotlight className="left-60 top-22 h-[60vh] w-[250vw]" fill="red" />
            <Spotlight className="left-90 top-26 h-[70vh] w-[50vw]" fill="red" />
            <Spotlight className="left-120 top-26 h-[90vh] w-[50vw]" fill="red" />
            <Spotlight className="left-160 top-28 h-[110vh] w-[50vw]" fill="red" />
            <Spotlight className="left-200 top-28 h-[130vh] w-[50vw]" fill="red" />
            <Spotlight className="left-240 top-28 h-[150vh] w-[50vw]" fill="red" />
            <Spotlight className="left-280 top-28 h-[170vh] w-[50vw]" fill="red" />
            <Spotlight className="left-320 top-28 h-[210vh] w-[50vw]" fill="red" />
            <Spotlight className="left-326 top-28 h-[230vh] w-[50vw]" fill="red" />
            <Spotlight className="left-330 top-28 h-[80vh] w-[50vw]" fill="red" />
            <Spotlight className="left-360 top-28 h-[80vh] w-[50vw]" fill="red" />
            <Spotlight className="left-400 top-28 h-[80vh] w-[50vw]" fill="red" />
            <Spotlight className="left-440 top-28 h-[80vh] w-[50vw]" fill="red" />
        </div>

        <BackgroundBeams className="z-0" />

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xl text-center text-blue-100 max-w-80">
            Welcome to RavenSec
          </p>
          <TextGenerateEffect
            words="Know Your APIs. Protect What Matters. Detect Your Traffic. Defend Your Assets."
            className="text-center text-[30px] md:text-3xl lg:text-4xl xl:text-5xl font-bold"
          />
            <br />
          <p className="text-center md:tracking-wider mb-4 text-xs md:text-sm lg:text-base max-w-4xl">
            Inspect API traffic to map endpoints, classify data types, verify authentication, and detect sensitive information.
          </p>

          <a href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero