"use client"

import { CheckCircle2, Clock, Lock, Star, TrendingUp, Award, Zap, Target, X } from "lucide-react"
import { cn } from "../lib/utils"

type Course = {
  id: string
  name: string
  credits: number
  semester: number
  prereqs: string[]
}

// Componente interno para los detalles del curso en móvil
function MobileCourseDetails({
  course,
  completedCourses,
  stats,
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
  onToggleCompletion: (courseId: string) => void
  onSelectCourse: (course: Course) => void
  arePrereqsMet: (course: Course, completed: string[]) => boolean
}) {
  const isCompleted = completedCourses.includes(course.id)

  return (
    <div className="space-y-5">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-xl backdrop-blur-sm",
              isCompleted
                ? "bg-emerald-200/60 text-emerald-700"
                : arePrereqsMet(course, completedCourses)
                  ? "bg-blue-200/60 text-blue-700"
                  : "bg-red-200/60 text-red-700",
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
            <h2 className="text-xl font-bold text-gray-800">{course.id}</h2>
            <p className="text-gray-600 text-base">{course.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-gray-600 text-sm">Créditos</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{course.credits}</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 text-sm">Semestre</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{course.semester}</span>
          </div>
        </div>

        {/* Prerequisites info */}
        {course.prereqs.length > 0 && (
          <div className="bg-gray-100/60 backdrop-blur-sm border border-gray-200/40 rounded-xl p-4">
            <p className="text-gray-700 text-sm">
              <strong>Prerrequisitos:</strong> {course.prereqs.join(", ")}
            </p>
          </div>
        )}

        <button
          onClick={() => onToggleCompletion(course.id)}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300",
            "backdrop-blur-sm border-2 shadow-lg",
            isCompleted
              ? "bg-red-100/80 hover:bg-red-100 text-red-700 border-red-300"
              : "bg-emerald-100/80 hover:bg-emerald-100 text-emerald-700 border-emerald-300",
          )}
        >
          {isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        </button>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Resumen de Progreso
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-100/40 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-medium text-sm">Completadas</span>
            </div>
            <span className="text-3xl font-bold text-emerald-800">{stats.approved}</span>
          </div>

          <div className="bg-blue-100/40 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">Disponibles</span>
            </div>
            <span className="text-3xl font-bold text-blue-800">{stats.canTake.length}</span>
          </div>

          <div className="bg-red-100/40 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium text-sm">Bloqueadas</span>
            </div>
            <span className="text-3xl font-bold text-red-800">{stats.blocked.length}</span>
          </div>

          <div className="bg-purple-100/40 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">Restantes</span>
            </div>
            <span className="text-3xl font-bold text-purple-800">{stats.semestersLeft}</span>
          </div>
        </div>
      </div>

      {/* Available Courses */}
      {stats.canTake.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Listas para Cursar
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.canTake.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="bg-emerald-100/40 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 hover:bg-emerald-100/60 transition-all duration-200 cursor-pointer"
                onClick={() => onSelectCourse(course)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-semibold text-base">{course.id}</span>
                  <span className="text-emerald-600 text-sm">{course.credits} créditos</span>
                </div>
                <p className="text-emerald-700 text-sm mt-1">{course.name}</p>
              </div>
            ))}
            {stats.canTake.length > 5 && (
              <p className="text-center text-emerald-600 text-sm font-medium">
                +{stats.canTake.length - 5} más
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blocked Courses - mostrar solo si el curso actual está bloqueado */}
      {!isCompleted && !arePrereqsMet(course, completedCourses) && (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Por qué está bloqueada
          </h4>
          <div className="bg-red-100/40 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
            <p className="text-red-800 text-sm font-medium mb-2">
              Necesitas completar:
            </p>
            <div className="flex flex-wrap gap-2">
              {course.prereqs.map((prereq) => (
                <span
                  key={prereq}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium",
                    completedCourses.includes(prereq)
                      ? "bg-emerald-200/60 text-emerald-800 line-through opacity-60"
                      : "bg-red-200/60 text-red-800",
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
  onToggleCompletion,
  onSelectCourse,
  arePrereqsMet,
  isMobile,
  isOpen,
  onClose,
}: SidebarProps) {
  if (!selectedCourse) return null

  // En móvil, renderizar como modal
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
        )}

        {/* Modal */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl transition-all duration-300 ease-out max-h-[85vh]",
            isOpen ? "translate-y-0" : "translate-y-full pointer-events-none",
          )}
        >
          {/* Drag indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header con botón de cerrar */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Detalles del Curso</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto px-5 pb-6 space-y-5 max-h-[calc(85vh-4rem)]">
            <MobileCourseDetails
              course={selectedCourse}
              completedCourses={completedCourses}
              stats={stats}
              onToggleCompletion={onToggleCompletion}
              onSelectCourse={onSelectCourse}
              arePrereqsMet={arePrereqsMet}
            />
          </div>
        </div>
      </>
    )
  }

  // Desktop: sidebar fijo
  return (
    <div className="w-80 bg-white/80 backdrop-blur-xl border-l border-white/30 relative shadow-xl">
      <div className="h-full overflow-y-auto p-5 space-y-5">
        {/* Course Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg backdrop-blur-sm",
                completedCourses.includes(selectedCourse.id)
                  ? "bg-emerald-200/60 text-emerald-700"
                  : arePrereqsMet(selectedCourse, completedCourses)
                    ? "bg-blue-200/60 text-blue-700"
                    : "bg-red-200/60 text-red-700",
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
              <h2 className="text-lg font-semibold text-gray-800">{selectedCourse.id}</h2>
              <p className="text-gray-600 text-sm">{selectedCourse.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-gray-600 text-sm">Créditos</span>
              </div>
              <span className="text-gray-800 font-semibold">{selectedCourse.credits}</span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600 text-sm">Semestre</span>
              </div>
              <span className="text-gray-800 font-semibold">{selectedCourse.semester}</span>
            </div>
          </div>

          <button
            onClick={() => onToggleCompletion(selectedCourse.id)}
            className={cn(
              "w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300",
              "backdrop-blur-sm border shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
              completedCourses.includes(selectedCourse.id)
                ? "bg-red-100/60 hover:bg-red-100/80 text-red-700 border-red-200/60"
                : "bg-emerald-100/60 hover:bg-emerald-100/80 text-emerald-700 border-emerald-200/60",
            )}
          >
            {completedCourses.includes(selectedCourse.id) ? "Marcar como pendiente" : "Marcar como completada"}
          </button>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Resumen de Progreso
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-100/40 backdrop-blur-sm border border-emerald-200/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-medium text-sm">Completadas</span>
              </div>
              <span className="text-xl font-bold text-emerald-800">{stats.approved}</span>
            </div>

            <div className="bg-blue-100/40 backdrop-blur-sm border border-blue-200/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">Disponibles</span>
              </div>
              <span className="text-xl font-bold text-blue-800">{stats.canTake.length}</span>
            </div>

            <div className="bg-red-100/40 backdrop-blur-sm border border-red-200/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-red-600" />
                <span className="text-red-700 font-medium text-sm">Bloqueadas</span>
              </div>
              <span className="text-xl font-bold text-red-800">{stats.blocked.length}</span>
            </div>

            <div className="bg-purple-100/40 backdrop-blur-sm border border-purple-200/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Restantes</span>
              </div>
              <span className="text-xl font-bold text-purple-800">{stats.semestersLeft}</span>
            </div>
          </div>
        </div>

        {/* Available Courses */}
        {stats.canTake.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Listas para Cursar
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.canTake.map((course) => (
                <div
                  key={course.id}
                  className="bg-emerald-100/40 backdrop-blur-sm border border-emerald-200/50 rounded-lg p-3 hover:bg-emerald-100/60 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => onSelectCourse(course)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800 font-medium text-sm">{course.id}</span>
                    <span className="text-emerald-600 text-xs">{course.credits} créditos</span>
                  </div>
                  <p className="text-emerald-700 text-xs mt-1">{course.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blocked Courses */}
        {stats.blocked.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-600" />
              Requieren Prerrequisitos
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.blocked.map((course) => (
                <div
                  key={course.id}
                  className="bg-red-100/40 backdrop-blur-sm border border-red-200/50 rounded-lg p-3 hover:bg-red-100/60 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => onSelectCourse(course)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-red-800 font-medium text-sm">{course.id}</span>
                    <span className="text-red-600 text-xs">{course.credits} créditos</span>
                  </div>
                  <p className="text-red-700 text-xs mt-1">{course.name}</p>
                  {course.prereqs.length > 0 && (
                    <p className="text-red-600 text-xs mt-1">Requiere: {course.prereqs.join(", ")}</p>
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
