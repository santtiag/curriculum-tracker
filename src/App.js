import React, { useState } from 'react';
import ReactFlow, { // 👈 Versión CORRECTA
  MiniMap,
  Controls,
  Background
} from 'reactflow'; // ⚠️ Cambiado a 'reactflow' (no react-flow-renderer)
import 'reactflow/dist/style.css'; // 👈 Estilos obligatorios
import './App.css';
import courses from './data/courses.json';

const nodeWidth = 200;
const nodeHeight = 80;
const horizontalSpacing = 250;
const verticalSpacing = 120;

function App() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const toggleCompletion = (courseId) => {
    setCompletedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // 📌 Importante: Usa `onNodeClick` aquí (no en data.onClick)
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
        style: { // 👇 Movimos el cursor aquí para feedback visual
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

  const maxSemester = Math.max(...courses.map(c => c.semester));
  const currentMaxSemester = Math.max(
    0,
    ...courses.filter(c => completedCourses.includes(c.id)).map(c => c.semester)
  );
  const semestersLeft = maxSemester - currentMaxSemester;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 🔶 Zona del grafo (¡con onNodeClick aquí!) */}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: '10px', textAlign: 'center' }}>
          Visualizador de Dependencias
        </h2>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="top-right"
          onNodeClick={onNodeClick} // ✅ ¡ESTO ES CLAVE!
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* 🔶 Panel lateral (funciona al hacer click) */}
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
  );
}

function arePrereqsMet(course, completed) {
  return course.prereqs.every(req => completed.includes(req));
}

export default App;
