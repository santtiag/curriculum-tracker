"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { BookOpen, CheckCircle2, Lock, Star } from "lucide-react"
import { cn } from "../lib/utils"

export function CourseNode({ data, selected }: NodeProps) {
  const { course, isCompleted, isAvailable } = data

  const getNodeStyle = () => {
    if (isCompleted) return "completed"
    if (isAvailable) return "available"
    return "blocked"
  }

  const getIcon = () => {
    if (isCompleted) return <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
    if (isAvailable) return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
    return <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
  }

  const nodeStyle = getNodeStyle()

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.04]",
        "backdrop-blur-xl border rounded-xl p-3.5 sm:p-4",
        "min-w-[150px] sm:min-w-[160px]",
        selected && "ring-2 ring-cyan-400/40 ring-offset-2 ring-offset-slate-950",
        {
          // Completed — emerald glow
          "bg-emerald-950/50 border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.25)] hover:border-emerald-400/50":
            nodeStyle === "completed",
          // Available — cyan glow with pulse
          "bg-cyan-950/40 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:border-cyan-400/50 animate-border-glow":
            nodeStyle === "available",
          // Blocked — muted dark
          "bg-slate-900/60 border-slate-700/40 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:border-slate-600/50":
            nodeStyle === "blocked",
        },
      )}
    >
      <div className="flex flex-col h-full">
        {/* Top row: icon + credits */}
        <div className="flex items-center justify-between mb-2.5">
          <div
            className={cn("flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300", {
              "bg-emerald-500/20 text-emerald-400": nodeStyle === "completed",
              "bg-cyan-500/20 text-cyan-400": nodeStyle === "available",
              "bg-slate-700/40 text-slate-500": nodeStyle === "blocked",
            })}
          >
            {getIcon()}
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-semibold text-amber-300">{course.credits}</span>
          </div>
        </div>

        {/* Course info */}
        <div className="flex-1">
          <h3 className="font-bold text-slate-100 text-sm mb-0.5 leading-tight tracking-tight">{course.id}</h3>
          <p className={cn(
            "text-xs leading-tight line-clamp-2 transition-colors duration-300",
            {
              "text-emerald-300/70": nodeStyle === "completed",
              "text-cyan-300/70": nodeStyle === "available",
              "text-slate-500": nodeStyle === "blocked",
            }
          )}>{course.name}</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/5">
          <span className={cn(
            "text-[11px] font-medium",
            {
              "text-emerald-400/60": nodeStyle === "completed",
              "text-cyan-400/60": nodeStyle === "available",
              "text-slate-600": nodeStyle === "blocked",
            }
          )}>Sem {course.semester}</span>
          {course.prereqs.length > 0 && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              {course.prereqs.length}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 border border-cyan-500/30 bg-slate-900/90 hover:bg-cyan-500/30 transition-colors duration-200"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 border border-cyan-500/30 bg-slate-900/90 hover:bg-cyan-500/30 transition-colors duration-200"
      />
    </div>
  )
}
