import React, { useState } from 'react';
import { Feather, X } from 'lucide-react';
import type { User } from '../types';
import { ComposeBox } from './ComposeBox';

interface MobileFabProps {
  currentUser: User;
  onPostCreated: (title: string, body: string, mediaUrl?: string) => void;
}

export const MobileFab: React.FC<MobileFabProps> = ({
  currentUser,
  onPostCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sticky Floating Action Button (Mobile & Tablet only) */}
      <div className="fixed bottom-6 right-5 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#00B59C] hover:bg-[#009d87] text-white shadow-xl shadow-[#00B59C]/40 flex items-center justify-center active:scale-95 transition-all duration-200 focus:outline-none"
          title="Compose Chirp"
          aria-label="Compose new chirp"
        >
          <Feather className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-lg z-10 animate-fade-in">
            <div className="absolute -top-11 right-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ComposeBox
              currentUser={currentUser}
              onPostCreated={(title, body, media) => {
                onPostCreated(title, body, media);
                setIsOpen(false);
              }}
              onSuccess={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
