"use client"

import { X, Github, Linkedin, GraduationCap, Heart } from "lucide-react"
import { cn } from "../lib/utils"

interface CreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative glass-dark rounded-2xl shadow-2xl shadow-black/50",
          "w-full max-w-sm p-7 transform transition-all duration-400 ease-out animate-fadeInScale",
          "border-cyan-500/10",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group"
        >
          <X className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-full blur-lg animate-glow-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-violet-500/15 rounded-full flex items-center justify-center border border-cyan-500/20">
              <GraduationCap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold gradient-text mb-1">Desarrollado con</h2>
          <div className="flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-slate-400 text-sm">por</span>
          </div>
        </div>

        {/* Credits */}
        <div className="space-y-3">
          <div className="group p-4 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/10 hover:border-cyan-500/25 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all">
                <img src="https://avatars.githubusercontent.com/u/96261455?v=4" className="w-10 h-10 rounded-full object-cover"/>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200 text-sm">Santiago Romero</h3>
                <p className="text-slate-500 text-xs">Backend & AI Developer</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="https://github.com/santtiag" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors">
                  <Github className="w-4 h-4 text-slate-400 hover:text-cyan-400 transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/santiago-romero-92887418a/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-400 hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          <div className="group p-4 rounded-xl bg-gradient-to-r from-violet-500/5 to-purple-500/5 border border-violet-500/10 hover:border-violet-500/25 transition-all duration-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all">
                <img src="https://avatars.githubusercontent.com/u/128250217?v=4" className="w-10 h-10 rounded-full object-cover"/>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200 text-sm">Steven Tete</h3>
                <p className="text-slate-500 text-xs">UX/UI Designer</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a href="https://github.com/steventete" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-violet-500/10 transition-colors">
                  <Github className="w-4 h-4 text-slate-400 hover:text-violet-400 transition-colors" />
                </a>
                <a href="https://www.linkedin.com/in/steventete/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-violet-500/10 transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-400 hover:text-violet-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-slate-800/60 text-center">
          <p className="text-slate-600 text-xs">Curriculum Tracker v2.0 • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
