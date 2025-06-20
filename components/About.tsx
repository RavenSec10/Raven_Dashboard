"use client";
import React, { useState } from 'react'
import { ContainerScroll } from './ui/ContainerScrollAnimation'
import Image from 'next/image'
import { Play } from 'lucide-react'

const About = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const useVideo = true
  
  const handlePlayVideo = () => {
    setIsVideoPlaying(true)
  }

  return (
    <div className="bg-white dark:bg-slate-950 -mt-40 md:-mt-60">
      <ContainerScroll
        titleComponent={
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Real-Time <span className="text-red-500">API Security</span> Intelligence
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Watch how RavenSec automatically hunts vulnerabilities, maps attack surfaces, and shields your APIs from data breaches in production environments.
            </p>
          </div>
        }
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {useVideo ? (
            // Video Section
            <div className="relative h-full w-full">
              {!isVideoPlaying ? (
                <div className="relative h-full w-full cursor-pointer" onClick={handlePlayVideo}>
                  <Image
                    src="/about-img.png"
                    alt="Video Thumbnail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 dark:bg-black/50 dark:hover:bg-black/40 transition-colors">
                    <div className="bg-white/90 hover:bg-white dark:bg-white/90 dark:hover:bg-white transition-colors rounded-full p-6 md:p-8">
                      <Play className="w-8 h-8 md:w-12 md:h-12 text-black fill-black ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/FTH6Dn3AyIQ?si=Z4r2Cp1yD_b3R_s7&autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ) : (
            // Image Section
            <div className="relative h-full w-full">
              <Image
                src="/about-img.png"
                alt="About Me"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent">
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    Real-Time API Security Intelligence
                  </h2>
                  <p className="text-sm md:text-base opacity-90 max-w-2xl">
                    Creating innovative digital solutions with cutting-edge technologies
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ContainerScroll>
    </div>
  )
}

export default About