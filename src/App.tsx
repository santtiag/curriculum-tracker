"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import ReactFlow, { Controls, Background, type Node, type Edge } from "reactflow"
import "reactflow/dist/style.css"

import { CourseNode } from "./components/CourseNode"
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { CreditsButton } from "./components/CreditsButton"
import { CreditsModal } from "./components/CreditsModal"

import coursesData from "./data/courses.json"

const courses = coursesData as Course[]

type Course = {
  id: string
  name: string
  credits: number
  semester: number
  prereqs: string[]
}

const horizontalSpacing = 350
const verticalSpacing = 180

function arePrereqsMet(course: Course, completed: string[]) {
  if (course.prereqs.length === 0) return true
  return course.prereqs.every((req) => completed.includes(req))
}

const nodeTypes = {
  course: CourseNode,
}

export default function App() {
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [lastClickedCourse, setLastClickedCourse] = useState<Course | null>(null)
  const [lastClickTime, setLastClickTime] = useState<number>(0)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleCompletion = useCallback(
    (courseId: string) => {
      setCompletedCourses((prev) => {
        const course = courses.find((c) => c.id === courseId)
        if (!course) return prev

        // Validar prerequisitos al marcar como completada
        if (!prev.includes(courseId)) {
          if (arePrereqsMet(course, prev)) {
            // Marcar como completada
            return [...prev, courseId]
          }
          // Si no cumple prerequisitos, no hacer nada (o mostrar mensaje)
          return prev
        }
        // Desmarcar (si ya está completada)
        return prev.filter((id) => id !== courseId)
      })
    },
    [],
  )

  // Click en nodo: completa directamente y selecciona para ver detalles
  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      const course = courses.find((c) => c.id === node.id)
      if (!course) return

      const now = Date.now()
      const isSameCourse = lastClickedCourse?.id === course.id
      const isDoubleClick = isSameCourse && (now - lastClickTime) < 500 // 500ms para double click

      // Completar o descompletar directamente (siempre en el primer click)
      const isCompleted = completedCourses.includes(course.id)

      if (!isCompleted && arePrereqsMet(course, completedCourses)) {
        setCompletedCourses((prev) => [...prev, course.id])
      } else if (isCompleted) {
        setCompletedCourses((prev) => prev.filter((id) => id !== course.id))
      }

      // Solo abrir sidebar si es doble click en la misma materia
      if (isDoubleClick) {
        setSelectedCourse(course)
        if (isMobile) {
          setIsSidebarOpen(true)
        }
      }

      setLastClickedCourse(course)
      setLastClickTime(now)
    },
    [completedCourses, isMobile, lastClickedCourse, lastClickTime],
  )

  const { nodes, edges } = useMemo(() => {
    // Group courses by semester for better positioning
    const coursesBySemester = courses.reduce(
      (acc, course) => {
        if (!acc[course.semester]) {
          acc[course.semester] = []
        }
        acc[course.semester].push(course)
        return acc
      },
      {} as Record<number, Course[]>,
    )

    const nodes: Node[] = []

    Object.entries(coursesBySemester).forEach(([semester, semesterCourses]) => {
      const semesterNum = Number.parseInt(semester)
      const x = (semesterNum - 1) * horizontalSpacing

      semesterCourses.forEach((course, index) => {
        const y = index * verticalSpacing

        const isCompleted = completedCourses.includes(course.id)
        const isAvailable = !isCompleted && arePrereqsMet(course, completedCourses)

        nodes.push({
          id: course.id,
          type: "course",
          position: { x, y },
          data: {
            course,
            isCompleted,
            isAvailable,
            onClick: () => {
              toggleCompletion(course.id)
              setSelectedCourse(course)
            },
          },
        })
      })
    })

    const edges: Edge[] = []
    courses.forEach((course) => {
      course.prereqs.forEach((prereq) => {
        edges.push({
          id: `e${prereq}-${course.id}`,
          source: prereq,
          target: course.id,
          animated: true,
          style: {
            stroke: "#006687",
            strokeWidth: 1.5,
          },
          type: "smoothstep",
        })
      })
    })

    return { nodes, edges }
  }, [completedCourses, toggleCompletion])

  const stats = useMemo(() => {
    const approved = completedCourses.length
    const pending = courses.length - completedCourses.length
    const canTake = courses.filter((c) => !completedCourses.includes(c.id) && arePrereqsMet(c, completedCourses))
    const blocked = courses.filter((c) => !completedCourses.includes(c.id) && !arePrereqsMet(c, completedCourses))

    // Calculate semesters left
    const completedTemp = [...completedCourses]
    const uncompleted = courses.filter((c) => !completedTemp.includes(c.id))
    let semesters = 0

    while (uncompleted.length > 0) {
      const available = uncompleted.filter((course) => arePrereqsMet(course, completedTemp))
      if (available.length === 0) break

      available.forEach((course) => {
        completedTemp.push(course.id)
      })
      semesters++

      uncompleted.splice(0, uncompleted.length)
      courses.forEach((course) => {
        if (!completedTemp.includes(course.id)) {
          uncompleted.push(course)
        }
      })
    }

    return { approved, pending, canTake, blocked, semestersLeft: semesters }
  }, [completedCourses])

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://transparenttextures.com/patterns/white-diamond.png)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="flex h-full relative z-10">
        {/* Main Flow Area */}
        <div className="flex-1 relative">
          <Header title="Curriculum Tracker" />
          <CreditsButton onClick={() => setIsCreditsModalOpen(true)} />

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            className="bg-[url('https://transparenttextures.com/patterns/translucent-fibres.png')]"
          >
            <Controls className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-lg shadow-xl" />
            <Background gap={20} size={1} color="#f0f0f0" />
          </ReactFlow>
        </div>

        <Sidebar
          selectedCourse={selectedCourse}
          completedCourses={completedCourses}
          stats={stats}
          onToggleCompletion={toggleCompletion}
          onSelectCourse={setSelectedCourse}
          arePrereqsMet={arePrereqsMet}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <CreditsModal isOpen={isCreditsModalOpen} onClose={() => setIsCreditsModalOpen(false)} />
    </div>
  )
}
