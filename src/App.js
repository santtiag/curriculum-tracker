import React, { Fragment, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import courses from './data/courses.json';
import { Analytics } from "@vercel/analytics/react"

const nodeWidth = 200;
const nodeHeight = 80;
const horizontalSpacing = 250;
const verticalSpacing = 120;

function App() {
    const [completedCourses, setCompletedCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const toggleCompletion = (courseId) => {
        setCompletedCourses((prev) => {
            const course = courses.find(c => c.id === courseId);

            // Si está tratando de aprobar una materia
            if (!prev.includes(courseId)) {
                // Solo permitimos aprobar si se cumplen los prerrequisitos
                if (arePrereqsMet(course, prev)) {
                    return [...prev, courseId];
                }
                // Si no se cumplen, no hacemos nada
                return prev;
            }

            // Si está desaprobando, permitimos sin validación
            return prev.filter((id) => id !== courseId);
        });
    };


    const onNodeClick = (event, node) => {
        const course = courses.find(c => c.id === node.id);
        if (course) {
            toggleCompletion(course.id);
            setSelectedCourse(course);
        }
    };

    const nodes = courses.map((course, index) => {
        const x = course.semester * horizontalSpacing;
        const y = (index % 8) * verticalSpacing;

        return {
            id: course.id,
            type: 'default',
            position: { x, y },
            data: {
                label: `${course.id} - ${course.name}`,
                style: {
                    cursor: 'pointer'
                }
            },
            style: {
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: completedCourses.includes(course.id)
                    ? '#4CAF50'
                    : arePrereqsMet(course, completedCourses)
                        ? '#FFA500'
                        : '#f44336',
                color: 'white',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
            }
        };
    });

    const edges = [];
    courses.forEach(course => {
        course.prereqs.forEach(prereq => {
            edges.push({
                id: `e${prereq}-${course.id}`,
                source: prereq,
                target: course.id,
                animated: true,
                style: { stroke: '#999', strokeWidth: 2 }
            });
        });
    });
    // WARNING: 
    // Solución Problema 2 No resuelto
    const calculateSemestersLeft = () => {
        // Copiamos el estado actual de materias aprobadas
        let completedTemp = [...completedCourses];
        const uncompleted = courses.filter(c => !completedTemp.includes(c.id));

        let semesters = 0;

        // Simulamos semestres hasta completar todas las materias
        while (uncompleted.length > 0) {
            // Materias que se pueden tomar en este semestre (prerrequisitos completos)
            const available = uncompleted.filter(course =>
                arePrereqsMet(course, completedTemp)
            );

            if (available.length === 0) {
                // No hay materias disponibles (bloqueadas permanentemente)
                break;
            }

            // Simulamos que aprobamos estas materias en el semestre actual
            available.forEach(course => {
                completedTemp.push(course.id);
            });

            semesters++;

            // Actualizamos la lista de materias pendientes
            uncompleted.length = 0;
            courses.forEach(course => {
                if (!completedTemp.includes(course.id)) {
                    uncompleted.push(course);
                }
            });
        }

        return semesters;
    };

    const stats = {
        approved: completedCourses.length,
        pending: courses.length - completedCourses.length,
        canTake: courses.filter(
            c => !completedCourses.includes(c.id) && arePrereqsMet(c, completedCourses)
        ),
        blocked: courses.filter(
            c => !completedCourses.includes(c.id) && !arePrereqsMet(c, completedCourses)
        )
    };


    const semestersLeft = calculateSemestersLeft();

    return (
        <>
            <Analytics />

            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '10px', textAlign: 'center' }}>
                        Visualizador Curricular
                    </h2>
                    <span style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', mixBlendMode: 'difference', zIndex: 999 }}>
                        by Santiago Romero
                    </span>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        fitView
                        attributionPosition="top-right"
                        onNodeClick={onNodeClick}
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={20} size={1} />
                    </ReactFlow>
                </div>

                {/* Panel lateral - Click */}
                {selectedCourse && (
                    <div style={{
                        width: '300px',
                        backgroundColor: '#fff',
                        borderLeft: '2px solid #eee',
                        padding: '20px',
                        overflowY: 'auto',
                        boxShadow: '-5px 0 10px rgba(0,0,0,0.1)',
                    }}>
                        <h3 style={{ color: '#1a237e' }}>
                            {selectedCourse.id} - {selectedCourse.name}
                        </h3>

                        <div style={{ marginBottom: '15px' }}>
                            <p><strong>Estado:</strong> {completedCourses.includes(selectedCourse.id) ? '✅ Aprobada' : '⏳ Pendiente'}</p>
                            <p><strong>Créditos:</strong> {selectedCourse.credits}</p>
                            <p><strong>Semestre teórico:</strong> {selectedCourse.semester}</p>

                            <button
                                style={{
                                    backgroundColor: completedCourses.includes(selectedCourse.id) ? '#d32f2f' : '#43a047',
                                    color: 'white',
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                                onClick={() => toggleCompletion(selectedCourse.id)}
                            >
                                {completedCourses.includes(selectedCourse.id) ? 'Desaprobar' : 'Marcar como aprobada'}
                            </button>
                        </div>

                        <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />

                        <h4 style={{ marginBottom: '10px' }}>📊 Estadísticas generales</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li>✅ Aprobadas: <strong>{stats.approved}</strong></li>
                            <li>🟡 Disponibles: <strong>{stats.canTake.length}</strong></li>
                            <li>⛔ Bloqueadas: <strong>{stats.blocked.length}</strong></li>
                            <li>🎓 Semestres restantes: <strong>{semestersLeft}</strong></li>
                        </ul>

                        <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>📚 Cursos disponibles YA</h4>
                        {stats.canTake.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {stats.canTake.map(c => (
                                    <li key={c.id} style={{
                                        background: '#e8f5e9',
                                        padding: '8px',
                                        margin: '5px 0',
                                        borderRadius: '4px'
                                    }}>
                                        {c.id} - {c.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tienes cursos disponibles aún.</p>
                        )}

                        <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>🔒 Cursos bloqueados</h4>
                        {stats.blocked.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {stats.blocked.map(c => (
                                    <li key={c.id} style={{
                                        background: '#ffebee',
                                        padding: '8px',
                                        margin: '5px 0',
                                        borderRadius: '4px'
                                    }}>
                                        {c.id} - {c.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tienes cursos bloqueados.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// Función auxiliar mejorada
function arePrereqsMet(course, completed) {
    // Materias sin prerrequisitos siempre están disponibles
    if (course.prereqs.length === 0) return true;

    // Verificamos que todos los prerrequisitos estén completos
    return course.prereqs.every(req => completed.includes(req));
}


export default App;
