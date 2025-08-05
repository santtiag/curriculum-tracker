"use client"

import { X, Github, Linkedin, GraduationCap } from "lucide-react"
import { cn } from "../lib/utils"

interface CreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl",
          "w-96 p-8 transform transition-all duration-500 ease-out",
          isOpen ? "scale-100 opacity-100 translate-y-0 fade-in-scale" : "scale-95 opacity-0 translate-y-4",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-2xl"><GraduationCap /></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Desarrollado por</h2>
        </div>

        {/* Credits */}
        <div className="space-y-4">
          <div className="group p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/50 hover:border-blue-200/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100/60 rounded-full flex items-center justify-center">
                <img src="https://avatars.githubusercontent.com/u/96261455?v=4" className="text-blue-600 font-semibold text-sm rounded-full size-10"/>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Santiago Romero</h3>
                <p className="text-gray-600 text-xs">Backend & AI Developer</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href="https://github.com/santtiag" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-100/50 transition-colors">
                  <Github className="w-4 h-4 text-gray-600" />
                </a>
                <a href="https://www.linkedin.com/in/santtiago-romero-92887418a" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-100/50 transition-colors">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="group p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:border-purple-200/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100/60 rounded-full flex items-center justify-center">
                <img src="https://avatars.githubusercontent.com/u/128250217?v=4" className="text-blue-600 font-semibold text-sm rounded-full size-10"/>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Steven Tete</h3>
                <p className="text-gray-600 text-xs">UX/UI Designer</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href="https://github.com/steventete" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-purple-100/50 transition-colors">
                  <Github className="w-4 h-4 text-gray-600" />
                </a>
                <a href="https://www.linkedin.com/in/steventete/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-purple-100/50 transition-colors">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
          <p className="text-gray-500 text-xs">Curriculum Tracker v1.0 • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
