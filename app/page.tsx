import Hero from "@/components/Hero";
import { navItems } from "@/data";
import { FloatingNav } from "@/components/ui/FloatingNav";
import About from "@/components/About";
import Grid from "@/components/Grid";
import Cards from "@/components/Cards";
import Footer from "@/components/Footer";

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
