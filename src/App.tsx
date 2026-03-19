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

  // Detect screen size
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

        if (!prev.includes(courseId)) {
          if (arePrereqsMet(course, prev)) {
            return [...prev, courseId]
          }
          return prev
        }
        return prev.filter((id) => id !== courseId)
      })
    },
    [],
  )

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      const course = courses.find((c) => c.id === node.id)
      if (!course) return

      const now = Date.now()
      const isSameCourse = lastClickedCourse?.id === course.id
      const isDoubleClick = isSameCourse && (now - lastClickTime) < 500

      const isCompleted = completedCourses.includes(course.id)

      if (!isCompleted && arePrereqsMet(course, completedCourses)) {
        setCompletedCourses((prev) => [...prev, course.id])
      } else if (isCompleted) {
        setCompletedCourses((prev) => prev.filter((id) => id !== course.id))
      }

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
        const isPrereqCompleted = completedCourses.includes(prereq)
        const isCourseCompleted = completedCourses.includes(course.id)
        const bothCompleted = isPrereqCompleted && isCourseCompleted

        edges.push({
          id: `e${prereq}-${course.id}`,
          source: prereq,
          target: course.id,
          animated: !bothCompleted,
          style: {
            stroke: bothCompleted
              ? "rgba(52, 211, 153, 0.3)"
              : isPrereqCompleted
                ? "rgba(34, 211, 238, 0.5)"
                : "rgba(148, 163, 184, 0.15)",
            strokeWidth: bothCompleted ? 1 : 1.5,
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

  const progressPercent = Math.round((completedCourses.length / courses.length) * 100)

  return (
    <div className="h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern" />
        {/* Top-left glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        {/* Bottom-right glow */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="flex h-full relative z-10">
        {/* Main Flow Area */}
        <div className="flex-1 relative">
          <Header title="Curriculum Tracker" progress={progressPercent} />
          <CreditsButton onClick={() => setIsCreditsModalOpen(true)} />

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
          >
            <Controls />
            <Background gap={24} size={1} color="rgba(148, 163, 184, 0.04)" />
          </ReactFlow>
        </div>

        <Sidebar
          selectedCourse={selectedCourse}
          completedCourses={completedCourses}
          stats={stats}
          totalCourses={courses.length}
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
