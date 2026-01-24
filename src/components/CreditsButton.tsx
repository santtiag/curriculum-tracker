"use client"

import { InfoIcon } from "lucide-react"

interface CreditsButtonProps {
  onClick: () => void
}

export function CreditsButton({ onClick }: CreditsButtonProps) {
  return (
    <div className="absolute bottom-20 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 scale-100 sm:scale-110">
      <button
        onClick={onClick}
        className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-lg px-4 sm:px-4 py-2 sm:py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-blue-500/10 hover:border-blue-200 cursor-pointer hover:text-blue-600 active:scale-95"
      >
        <span className="text-gray-600 text-xs sm:text-xs font-medium flex items-center">
          <InfoIcon size={16} className="mr-1" />
          <span className="text-xs sm:text-xs">Créditos</span>
        </span>
      </button>
    </div>
  )
}
