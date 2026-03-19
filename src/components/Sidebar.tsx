"use client"

import { CheckCircle2, Clock, Lock, Star, TrendingUp, Award, Zap, Target, X, BarChart3 } from "lucide-react"
import { cn } from "../lib/utils"

type Course = {
  id: string
  name: string
  credits: number
  semester: number
  prereqs: string[]
}

/* ============================
   Progress Ring SVG Component
   ============================ */
function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold gradient-text">{progress}%</span>
      </div>
    </div>
  )
}

/* ============================
   Mobile Course Details
   ============================ */
function MobileCourseDetails({
  course,
  completedCourses,
  stats,
  totalCourses,
  onToggleCompletion,
  onSelectCourse,
  arePrereqsMet,
}: {
  course: Course
  completedCourses: string[]
  stats: {
    approved: number
    pending: number
    canTake: Course[]
    blocked: Course[]
    semestersLeft: number
  }
  totalCourses: number
  onToggleCompletion: (courseId: string) => void
  onSelectCourse: (course: Course) => void
  arePrereqsMet: (course: Course, completed: string[]) => boolean
}) {
  const isCompleted = completedCourses.includes(course.id)
  const progress = totalCourses > 0 ? Math.round((stats.approved / totalCourses) * 100) : 0

  return (
    <div className="space-y-5 animate-fadeInUp">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-xl transition-colors",
              isCompleted
                ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                : arePrereqsMet(course, completedCourses)
                  ? "bg-cyan-500/15 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  : "bg-slate-800/60 text-slate-500",
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : arePrereqsMet(course, completedCourses) ? (
              <Clock className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-100">{course.id}</h2>
            <p className="text-slate-400 text-sm">{course.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-slate-500 text-xs">Créditos</span>
            </div>
            <span className="text-2xl font-bold text-slate-100">{course.credits}</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-500 text-xs">Semestre</span>
            </div>
            <span className="text-2xl font-bold text-slate-100">{course.semester}</span>
          </div>
        </div>

        {/* Prerequisites info */}
        {course.prereqs.length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-4">
            <p className="text-slate-400 text-sm">
              <strong className="text-slate-300">Prerrequisitos:</strong> {course.prereqs.join(", ")}
            </p>
          </div>
        )}

        <button
          onClick={() => onToggleCompletion(course.id)}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 cursor-pointer",
            "border shadow-lg active:scale-[0.98]",
            isCompleted
              ? "bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border-rose-500/20 hover:border-rose-500/30 hover:shadow-[0_0_25px_rgba(251,113,133,0.1)]"
              : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30 hover:shadow-[0_0_25px_rgba(52,211,153,0.1)]",
          )}
        >
          {isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        </button>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Progreso
          </h3>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center py-2">
          <ProgressRing progress={progress} size={90} strokeWidth={7} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Completadas" value={stats.approved} color="emerald" />
          <StatCard icon={<Zap className="w-4 h-4" />} label="Disponibles" value={stats.canTake.length} color="cyan" />
          <StatCard icon={<Lock className="w-4 h-4" />} label="Bloqueadas" value={stats.blocked.length} color="rose" />
          <StatCard icon={<Target className="w-4 h-4" />} label="Sem. restantes" value={stats.semestersLeft} color="violet" />
        </div>
      </div>

      {/* Available Courses */}
      {stats.canTake.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Listas para Cursar
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.canTake.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 cursor-pointer"
                onClick={() => onSelectCourse(c)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold text-sm">{c.id}</span>
                  <span className="text-emerald-500/70 text-xs">{c.credits} créditos</span>
                </div>
                <p className="text-emerald-400/50 text-xs mt-1">{c.name}</p>
              </div>
            ))}
            {stats.canTake.length > 5 && (
              <p className="text-center text-emerald-500/60 text-sm font-medium">
                +{stats.canTake.length - 5} más
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blocked reason */}
      {!isCompleted && !arePrereqsMet(course, completedCourses) && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            Por qué está bloqueada
          </h4>
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
            <p className="text-rose-300/80 text-sm font-medium mb-2">Necesitas completar:</p>
            <div className="flex flex-wrap gap-2">
              {course.prereqs.map((prereq) => (
                <span
                  key={prereq}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium",
                    completedCourses.includes(prereq)
                      ? "bg-emerald-500/10 text-emerald-400/60 line-through"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/15",
                  )}
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================
   Stat Card Sub-Component
   ============================ */
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, { bg: string; border: string; icon: string; label: string; value: string }> = {
    emerald: {
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/10 hover:border-emerald-500/20",
      icon: "text-emerald-400",
      label: "text-emerald-400/60",
      value: "text-emerald-300",
    },
    cyan: {
      bg: "bg-cyan-500/5",
      border: "border-cyan-500/10 hover:border-cyan-500/20",
      icon: "text-cyan-400",
      label: "text-cyan-400/60",
      value: "text-cyan-300",
    },
    rose: {
      bg: "bg-rose-500/5",
      border: "border-rose-500/10 hover:border-rose-500/20",
      icon: "text-rose-400",
      label: "text-rose-400/60",
      value: "text-rose-300",
    },
    violet: {
      bg: "bg-violet-500/5",
      border: "border-violet-500/10 hover:border-violet-500/20",
      icon: "text-violet-400",
      label: "text-violet-400/60",
      value: "text-violet-300",
    },
  }

  const c = colorMap[color] || colorMap.cyan

  return (
    <div className={cn("rounded-xl p-3 border transition-all duration-300", c.bg, c.border)}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={c.icon}>{icon}</span>
        <span className={cn("font-medium text-xs", c.label)}>{label}</span>
      </div>
      <span className={cn("text-xl font-bold", c.value)}>{value}</span>
    </div>
  )
}

/* ============================
   Sidebar
   ============================ */
interface SidebarProps {
  selectedCourse: Course | null
  completedCourses: string[]
  stats: {
    approved: number
    pending: number
    canTake: Course[]
    blocked: Course[]
    semestersLeft: number
  }
  totalCourses: number
  onToggleCompletion: (courseId: string) => void
  onSelectCourse: (course: Course) => void
  arePrereqsMet: (course: Course, completed: string[]) => boolean
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  selectedCourse,
  completedCourses,
  stats,
  totalCourses,
  onToggleCompletion,
  onSelectCourse,
  arePrereqsMet,
  isMobile,
  isOpen,
  onClose,
}: SidebarProps) {
  const progress = totalCourses > 0 ? Math.round((stats.approved / totalCourses) * 100) : 0

  if (!selectedCourse) return null

  // Mobile: bottom sheet modal
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
        )}

        {/* Modal */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-2xl rounded-t-3xl shadow-2xl shadow-black/60 transition-all duration-300 ease-out max-h-[85vh]",
            "border-t border-slate-700/30",
            isOpen ? "translate-y-0" : "translate-y-full pointer-events-none",
          )}
        >
          {/* Drag indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-base font-semibold text-slate-200">Detalles del Curso</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="overflow-y-auto px-5 pb-6 space-y-5 max-h-[calc(85vh-4rem)]">
            <MobileCourseDetails
              course={selectedCourse}
              completedCourses={completedCourses}
              stats={stats}
              totalCourses={totalCourses}
              onToggleCompletion={onToggleCompletion}
              onSelectCourse={onSelectCourse}
              arePrereqsMet={arePrereqsMet}
            />
          </div>
        </div>
      </>
    )
  }

  // Desktop: fixed sidebar
  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800/50 relative shadow-2xl shadow-black/30">
      {/* Gradient accent line on left */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-violet-500/20 to-transparent" />

      <div className="h-full overflow-y-auto p-5 space-y-5">
        {/* Course Header */}
        <div className="space-y-4 animate-fadeInUp">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-colors",
                completedCourses.includes(selectedCourse.id)
                  ? "bg-emerald-500/15 text-emerald-400"
                  : arePrereqsMet(selectedCourse, completedCourses)
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "bg-slate-800/60 text-slate-500",
              )}
            >
              {completedCourses.includes(selectedCourse.id) ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : arePrereqsMet(selectedCourse, completedCourses) ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{selectedCourse.id}</h2>
              <p className="text-slate-400 text-sm">{selectedCourse.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-800/40 border border-slate-700/25 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-500 text-xs">Créditos</span>
              </div>
              <span className="text-slate-100 font-bold">{selectedCourse.credits}</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/25 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-500 text-xs">Semestre</span>
              </div>
              <span className="text-slate-100 font-bold">{selectedCourse.semester}</span>
            </div>
          </div>

          {/* Prerequisites */}
          {selectedCourse.prereqs.length > 0 && (
            <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3">
              <p className="text-slate-400 text-xs">
                <strong className="text-slate-300">Prereqs:</strong> {selectedCourse.prereqs.join(", ")}
              </p>
            </div>
          )}

          <button
            onClick={() => onToggleCompletion(selectedCourse.id)}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer",
              "border shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
              completedCourses.includes(selectedCourse.id)
                ? "bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border-rose-500/20 hover:border-rose-500/30"
                : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30",
            )}
          >
            {completedCourses.includes(selectedCourse.id) ? "Marcar como pendiente" : "Marcar como completada"}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* Progress Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Progreso General
          </h3>

          {/* Progress Ring */}
          <div className="flex items-center justify-center py-1">
            <ProgressRing progress={progress} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <StatCard icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Completadas" value={stats.approved} color="emerald" />
            <StatCard icon={<Zap className="w-3.5 h-3.5" />} label="Disponibles" value={stats.canTake.length} color="cyan" />
            <StatCard icon={<Lock className="w-3.5 h-3.5" />} label="Bloqueadas" value={stats.blocked.length} color="rose" />
            <StatCard icon={<Target className="w-3.5 h-3.5" />} label="Sem. restantes" value={stats.semestersLeft} color="violet" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* Available Courses */}
        {stats.canTake.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Listas para Cursar
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.canTake.map((course) => (
                <div
                  key={course.id}
                  className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 cursor-pointer transform hover:translate-x-0.5"
                  onClick={() => onSelectCourse(course)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 font-medium text-sm">{course.id}</span>
                    <span className="text-emerald-500/60 text-xs">{course.credits} cr</span>
                  </div>
                  <p className="text-emerald-400/40 text-xs mt-0.5">{course.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blocked Courses */}
        {stats.blocked.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Requieren Prerrequisitos
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.blocked.map((course) => (
                <div
                  key={course.id}
                  className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 hover:bg-rose-500/10 hover:border-rose-500/15 transition-all duration-200 cursor-pointer transform hover:translate-x-0.5"
                  onClick={() => onSelectCourse(course)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-rose-300 font-medium text-sm">{course.id}</span>
                    <span className="text-rose-500/60 text-xs">{course.credits} cr</span>
                  </div>
                  <p className="text-rose-400/40 text-xs mt-0.5">{course.name}</p>
                  {course.prereqs.length > 0 && (
                    <p className="text-rose-500/40 text-[10px] mt-1">Req: {course.prereqs.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
