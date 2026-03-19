import { GraduationCap, Sparkles } from "lucide-react"

type HeaderProps = {
  title: string
  progress?: number
}

export function Header({ title, progress = 0 }: HeaderProps) {
  return (
    <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 w-max">
      <div className="glass-dark rounded-2xl px-5 sm:px-7 py-2.5 sm:py-3.5 shadow-2xl border border-cyan-500/10 hover:border-cyan-500/20 transition-all duration-500 group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md group-hover:bg-cyan-400/30 transition-all duration-500" />
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold gradient-text tracking-tight">
              {title}
            </h1>
            {progress > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                  {progress}% completado
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
