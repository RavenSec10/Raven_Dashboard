'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { X, Loader2 } from 'lucide-react';

export default function CloseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    setIsLoading(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      router.push('/');
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClose}
        disabled={isLoading}
        variant="ghost" 
        size="icon" 
        className="h-12 w-12 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <X className="h-5 w-5 text-white" />
        )}
      </Button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex items-center gap-4 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            <span className="text-slate-900 font-semibold text-lg">Returning to Home Page...</span>
          </div>
        </div>
      )}
    </>
  );
}