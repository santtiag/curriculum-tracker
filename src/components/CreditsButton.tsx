"use client"

import { InfoIcon } from "lucide-react"

interface CreditsButtonProps {
  onClick: () => void
}

export function CreditsButton({ onClick }: CreditsButtonProps) {
  return (
    <div className="absolute bottom-20 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <button
        onClick={onClick}
        className="glass-dark rounded-xl px-4 py-2 shadow-lg hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 transform hover:scale-105 active:scale-95 border-cyan-500/10 hover:border-cyan-500/25 cursor-pointer group"
      >
        <span className="text-slate-400 group-hover:text-cyan-400 text-xs font-medium flex items-center gap-1.5 transition-colors duration-300">
          <InfoIcon size={14} className="group-hover:animate-float" />
          <span>Créditos</span>
        </span>
      </button>
    </div>
  )
}
