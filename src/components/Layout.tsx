
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import MobileMenu from "./MobileMenu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAccount } from "wagmi";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  // Log connection status for debugging
  console.log("Wagmi isConnected:", isConnected);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <Toaster />
      
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="bg-gray-900 border-r border-gray-800 p-0">
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;
