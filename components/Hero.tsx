import React from 'react'
import { Spotlight } from './ui/Spotlight';
import { BackgroundBeams } from './ui/BackgroundBeams';
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { FaLocationArrow } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className='pb-20 pt-36'>
        <div>
            <div className="block md:hidden">
                <Spotlight className="left-0 top-20 h-[40vh] w-[300vw]" fill="red" />
                <Spotlight className="left-20 top-20 h-[50vh] w-[200vw]" fill="red" />  
                <Spotlight className="left-40 top-20 h-[60vh] w-[150vw]" fill="red" />
            </div>
            
            {/* Tablet Spotlights - Medium complexity */}
            <div className="hidden md:block lg:hidden">
                <Spotlight className="left-2 top-22 h-[30vh] w-[250vw]" fill="red" />
                <Spotlight className="left-10 top-22 h-[40vh] w-[200vw]" fill="red" />
                <Spotlight className="left-20 top-22 h-[50vh] w-[150vw]" fill="red" />
                <Spotlight className="left-40 top-22 h-[60vh] w-[100vw]" fill="red" />
                <Spotlight className="left-60 top-24 h-[70vh] w-[80vw]" fill="red" />
            </div>
            
            {/* Desktop Spotlights - Full complexity */}
            <div className="hidden lg:block">
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
        </div>

        <BackgroundBeams className="z-0" />

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

          <a href="#about">
            <MagicButton
              title="Get Started"
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