import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

const Grid = () => {
  return (
    <section id="about">
        <div className="text-center mb-1">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Security Platform <span className="text-red-500">Built by Developers,</span> for Developers
        </h2>
        <p className="text-lg text-gray-400 max-w-4xl mx-auto">
            Born from our own frustration with clunky security tools. RavenSec protects your APIs without breaking your workflow or slowing down deployments.
        </p>
     </div>  
      <BentoGrid className="w-full py-20">
        {gridItems.map((item, i) => (
          <BentoGridItem
            id={item.id}
            key={i}
            title=<h1 dangerouslySetInnerHTML={{ __html: item.title }}></h1>
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;