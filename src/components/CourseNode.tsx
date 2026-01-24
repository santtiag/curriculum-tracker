"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { BookOpen, CheckCircle2, Lock, Star } from "lucide-react"
import { cn } from "../lib/utils"

export function CourseNode({ data, selected }: NodeProps) {
  const { course, isCompleted, isAvailable, onClick } = data

  const getNodeStyle = () => {
    if (isCompleted) return "completed"
    if (isAvailable) return "available"
    return "blocked"
  }

  const getIcon = () => {
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 sm:w-5 sm:h-5" />
    if (isAvailable) return <BookOpen className="w-5 h-5 sm:w-5 sm:h-5" />
    return <Lock className="w-5 h-5 sm:w-5 sm:h-5" />
  }

  const nodeStyle = getNodeStyle()

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.02]",
        "backdrop-blur-md border rounded-xl p-4 sm:p-4 shadow-lg hover:shadow-xl",
        "min-w-[140px] sm:min-w-[140px]",
        selected && "ring-2 ring-blue-300/50 ring-offset-2 ring-offset-white/50",
        {
          "bg-emerald-100/40 border-emerald-200/60 hover:bg-emerald-100/60": nodeStyle === "completed",
          "bg-blue-100/40 border-blue-200/60 hover:bg-blue-100/60": nodeStyle === "available",
          "bg-red-100/40 border-red-200/60 hover:bg-red-100/60": nodeStyle === "blocked",
        },
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn("flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-lg backdrop-blur-sm", {
              "bg-emerald-200/60 text-emerald-700": nodeStyle === "completed",
              "bg-blue-200/60 text-blue-700": nodeStyle === "available",
              "bg-red-200/60 text-red-700": nodeStyle === "blocked",
            })}
          >
            {getIcon()}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 sm:w-3 sm:h-3 text-amber-500" />
            <span className="text-xs font-medium text-gray-700">{course.credits}</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{course.id}</h3>
          <p className="text-gray-700 text-xs leading-tight line-clamp-2">{course.name}</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/30">
          <span className="text-xs text-gray-600">Sem {course.semester}</span>
          {course.prereqs.length > 0 && <span className="text-xs text-gray-600">{course.prereqs.length} req</span>}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 sm:w-2 sm:h-2 border border-gray-400/50 bg-white/80" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 sm:w-2 sm:h-2 border border-gray-400/50 bg-white/80" />
    </div>
  )
}
