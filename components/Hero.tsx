import React from 'react'
import { Spotlight } from './ui/Spotlight';
import { BackgroundBeams } from './ui/BackgroundBeams';
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { FaLocationArrow } from "react-icons/fa6";

const Hero = () => {
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
          className="-top-20 -right-20 md:-right-32 h-[70vh] w-[45vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-10 -left-20 h-[60vh] w-[40vw]"
          fill="red"
        />
        <Spotlight
          className="top-1/3 right-1/4 h-[50vh] w-[35vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-1/4 left-1/3 h-[45vh] w-[30vw]"
          fill="red"
        />
        <Spotlight
          className="-bottom-10 right-10 h-[55vh] w-[38vw]"
          fill="white"
        />
        <Spotlight
          className="top-1/2 -left-32 h-[65vh] w-[42vw]"
          fill="red"
        />
        <Spotlight
          className="top-16 right-1/3 h-[48vh] w-[32vw]"
          fill="white"
        />
        <Spotlight
          className="bottom-1/3 right-0 h-[52vh] w-[36vw]"
          fill="red"
        />
        <Spotlight
          className="-top-32 left-1/2 h-[58vh] w-[40vw]"
          fill="white"
        />
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