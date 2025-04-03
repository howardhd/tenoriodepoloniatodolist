import { useState } from 'react'
import './styles.css'

export default function App() {
  // MGA KATEGORYA - Warm color theme
  const categories = [
    { id: 1, name: 'MUST DO', color: '#FF6B6B' },     // Dapat gawin agad (Pula)
    { id: 2, name: 'SHOULD DO', color: '#FFA07A' },   // Dapat gawin (Light salmon)
    { id: 3, name: 'COULD DO', color: '#FFD166' },    // Pwedeng gawin (Dilaw)
    { id: 4, name: 'IF I HAVE TIME', color: '#FF9A76' } // Kung may oras (Peach)
  ]

  // STATE MANAGEMENT - Pag-iimbak ng mga task
  const [tasks, setTasks] = useState(() => {
    const initialTasks = {}
    categories.forEach(cat => {
      initialTasks[cat.id] = [] // Simula ng walang laman na tasks
    })
    return initialTasks
  })

  // Para sa bagong task
  const [newTask, setNewTask] = useState({ 
    text: '', 
    categoryId: categories[0].id // Default sa unang kategorya
  })

  // Para sa task na ine-edit
  const [editingTask, setEditingTask] = useState(null)

  /* ------------------- */
  /*  MGA CRUD FUNCTION  */
  /* ------------------- */

  // CREATE - Pagdagdag ng task
  const addTask = () => {
    if (!newTask.text.trim()) return // Hindi pwede blanko
    
    setTasks(prev => ({
      ...prev,
      [newTask.categoryId]: [
        ...prev[newTask.categoryId],
        {
          id: Date.now(), // Gumamit ng timestamp para unique ID
          text: newTask.text,
          completed: false
        }
      ]
    }))
    
    setNewTask({ ...newTask, text: '' }) // Reset input
  }

  // UPDATE - Pag-edit ng task
  const updateTask = () => {
    if (!editingTask.text.trim()) return
    
    setTasks(prev => ({
      ...prev,
      [editingTask.categoryId]: prev[editingTask.categoryId].map(task =>
        task.id === editingTask.id ? { ...task, text: editingTask.text } : task
      )
    }))
    
    setEditingTask(null) // Tapos na mag-edit
  }

  // TOGGLE - Mark as complete/incomplete
  const toggleComplete = (categoryId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }))
  }

  // DELETE - Pag-alis ng task
  const deleteTask = (categoryId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(task => task.id !== taskId)
    }))
  }

  // Check kung mobile view
  const isMobile = window.innerWidth < 768

  return (
    <div className="app">
      {/* HEADER */}
      <header>
        <h1>Priority Task Manager</h1>
        <p>Organize tasks by urgency</p>
      </header>

      {/* INPUT AREA */}
      <div className="task-input">
        <input
          type="text"
          value={editingTask ? editingTask.text : newTask.text}
          onChange={(e) => editingTask 
            ? setEditingTask({...editingTask, text: e.target.value}) 
            : setNewTask({...newTask, text: e.target.value})
          }
          placeholder={editingTask ? "I-edit ang task..." : "Magdagdag ng task..."}
          onKeyPress={(e) => e.key === 'Enter' && (editingTask ? updateTask() : addTask())}
        />

        {/* Category Dropdown */}
        <select
          value={editingTask ? editingTask.categoryId : newTask.categoryId}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            editingTask 
              ? setEditingTask({...editingTask, categoryId: val}) 
              : setNewTask({...newTask, categoryId: val})
          }}
          disabled={!!editingTask} // Hindi pwede palitan kategorya kapag nage-edit
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Action Buttons */}
        <button 
          onClick={editingTask ? updateTask : addTask}
          className={editingTask ? "update-btn" : "add-btn"}
        >
          {editingTask ? "Update" : "Add"}
        </button>

        {/* Cancel Edit Button */}
        {editingTask && (
          <button 
            onClick={() => setEditingTask(null)}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>

      {/* CATEGORY GRID */}
      <div className={`categories-grid ${isMobile ? "mobile-view" : ""}`}>
        {categories.map(category => (
          <div 
            key={category.id} 
            className="category"
            style={{ borderTop: `4px solid ${category.color}` }}
          >
            <h2>{category.name}</h2>
            
            {/* Task List */}
            <div className="task-list">
              {tasks[category.id].length === 0 ? (
                <p className="empty-state">Walang task dito</p>
              ) : (
                tasks[category.id].map(task => (
                  <div 
                    key={task.id} 
                    className={`task ${task.completed ? 'completed' : ''}`}
                  >
                    <span onClick={() => toggleComplete(category.id, task.id)}>
                      {task.text}
                    </span>
                    
                    {/* Action Buttons per Task */}
                    <div className="task-actions">
                      <button 
                        onClick={() => setEditingTask({
                          id: task.id,
                          text: task.text,
                          categoryId: category.id
                        })}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      
                      <button 
                        onClick={() => deleteTask(category.id, task.id)}
                        className="delete-btn"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}