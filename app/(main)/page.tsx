import Hero from "@/components/Hero";
import { navItems } from "@/data";
import React, { lazy } from 'react'
import About from "@/components/About";
import Grid from "@/components/Grid";
import Cards from "@/components/Cards";
import Footer from "@/components/Footer";
const FloatingNav = lazy(() => import('@/components/ui/FloatingNav').then(module => ({ default: module.FloatingNav })));
export default function Home() {
  return (
    <main className="relative bg-slate-950 flex justify-center items-center flex-col overflow-hidden mx-auto sm:pz-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero/>
        <About/>
        <Grid/>
        <Cards/>
        <Footer/>
      </div>
    </main>
  );
}
