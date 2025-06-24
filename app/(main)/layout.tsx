import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems } from "@/data/index";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingNav navItems={navItems} />
      <main>{children}</main>
    </>
  );
}