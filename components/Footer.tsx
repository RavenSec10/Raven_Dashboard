"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);
  const router = useRouter();

  const handleStartAssessmentClick = () => {
    setIsNavigatingToDashboard(true);
    router.push('/dashboard');
    setTimeout(() => {
      setIsNavigatingToDashboard(false);
    }, 3000);
  };

  return (
    <footer className="w-full pt-1 pb-10 relative" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50 "
        />
      </div>

      {/* Main content section */}
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          Ready to <span className="text-red-500">secure your APIs</span><br></br>
          and protect your data?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center max-w-2xl">
          Discover vulnerabilities, prevent attacks, and ensure your API infrastructure 
          is bulletproof. Let&apos;s build a comprehensive security strategy together.
        </p>
        <div 
          onClick={isNavigatingToDashboard ? undefined : handleStartAssessmentClick}
          className={cn(
            "transition-all duration-200",
            isNavigatingToDashboard 
              ? "opacity-70 cursor-not-allowed" 
              : "cursor-pointer hover:scale-105"
          )}
        >
          <MagicButton
            title={isNavigatingToDashboard ? "Loading..." : "Start Security Assessment"}
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

      <div className="flex flex-col items-center justify-start py-16">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Product Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold text-lg mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Test library</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Open Source</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Self-hosted</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cloud</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Traffic Connectors</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Changelog</a></li>
              </ul>
            </div>

            {/* API Security Academy Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold text-lg mb-6">API Security Academy</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Penetration Testing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">What is APIs?</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">REST API Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">GET vs POST</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">What is DevSecOps</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">DevSecOps Best Practices</a></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold text-lg mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Alternatives</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Learn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API CVE Database</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Questions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Podcast</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Developer Security Hub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Video Tutorials</a></li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="flex flex-col">
              <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Book demo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Email</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Responsible disclosure</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms & Policies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Trust Center</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Footer bottom section with social media and copyright */}
        <div className="absolute bottom-10 left-0 right-0 px-4">
        <div className="flex mt-16 md:flex-row flex-col justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <img
                src="/ravensec-logo.png"
                alt="RavenSec Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain"
              />
              <span className="font-semibold text-2xl">
                <span className="text-red-500">Raven</span>
                <span className="text-white">Sec</span>
             </span>
            </div>

            <div className="w-px h-6 bg-gray-600"></div>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {socialMedia.map((info) => (
                <div
                  key={info.id}
                  className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
                >
                  <img src={info.img} alt="icons" width={20} height={20} />
                </div>
              ))}
            </div>
          </div>
          
          <p className="md:text-base text-sm md:font-normal font-light text-center">
            Copyright © 2025 Team RavenSec
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;