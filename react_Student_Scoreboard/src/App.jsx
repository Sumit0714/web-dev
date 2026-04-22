import { useState } from 'react'
import Header from './components/Header'
import StudentTable from './components/StudentTable'
import AddStudentForm from './components/AddStudentForm'

const initialStudents = [
  { id: 1, name: 'Vishal Kumar Jha',  score: 72 },
  { id: 2, name: 'Aryan Yadav',   score: 87 },
  { id: 3, name: 'Sumit',  score: 61 },
  { id: 4, name: 'Ansh',   score: 90 },
  { id: 5, name: 'Varun', score: 69 },
]

function App() {
  const [students, setStudents] = useState(initialStudents)

  function updateScore(id, newScore) {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, score: newScore } : s))
    )
  }

  function addStudent(name, score) {
    setStudents(prev => [...prev, { id: Date.now(), name, score }])
  }

  const passing = students.filter(s => s.score >= 40).length
  const failing  = students.length - passing
  const avg = students.length
    ? Math.round(students.reduce((acc, s) => acc + s.score, 0) / students.length)
    : 0

  return (
    <>
      <Header total={students.length} />

      <div className="main">
        {/* Summary stats */}
        <div className="stats-row">
          <div className="stat-card">
            <p className="stat-label">Class Average</p>
            <p className="stat-value">{avg}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Passing</p>
            <p className="stat-value pass-color">{passing}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Failing</p>
            <p className="stat-value fail-color">{failing}</p>
          </div>
        </div>

        <StudentTable students={students} onUpdate={updateScore} />
        <AddStudentForm onAdd={addStudent} />
      </div>
    </>
  )
}

export default App