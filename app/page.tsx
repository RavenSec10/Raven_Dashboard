import Hero from "@/components/Hero";
import Image from "next/image";
import { navItems } from "@/data";
import { FloatingNav } from "@/components/ui/FloatingNav";

export default function Home() {
  return (
    <main className="relative bg-slate-950 flex justify-center items-center flex-col overflow-hidden mx-auto sm:pz-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero/>
      </div>
    </main>
  );
}
