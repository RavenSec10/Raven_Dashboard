import SideNav from '@/components/ui/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-72">
        <SideNav />
      </div>
      <div className="flex-grow overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-red-950/20">
        {children}
      </div>
    </div>
  );
}