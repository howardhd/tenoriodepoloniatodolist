// App.jsx - Main component
import { useState } from 'react'

export default function App() {
  // Define categories with warm color associations
  const categories = [
    { name: 'MUST DO', color: '#FF6B6B' },       // Warm red
    { name: 'SHOULD DO', color: '#FFA07A' },     // Light salmon
    { name: 'COULD DO', color: '#FFD166' },      // Warm yellow
    { name: 'IF I HAVE TIME', color: '#FF9A76' } // Peach
  ]

  // State for tasks grouped by category
  const [tasks, setTasks] = useState(() => {
    const initialTasks = {}
    categories.forEach(cat => {
      initialTasks[cat.name] = []
    })
    return initialTasks
  })

  // State for new task input
  const [newTask, setNewTask] = useState({ 
    text: '', 
    category: categories[0].name 
  })

  // Add a new task to the selected category
  const addTask = () => {
    if (!newTask.text.trim()) return // Prevent empty tasks
    
    setTasks(prev => ({
      ...prev,
      [newTask.category]: [
        ...prev[newTask.category],
        {
          id: Date.now(),
          text: newTask.text,
          completed: false
        }
      ]
    }))
    
    // Reset input field
    setNewTask(prev => ({ ...prev, text: '' }))
  }

  // Toggle task completion status
  const toggleTask = (category, id) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }))
  }

  // Delete a task
  const deleteTask = (category, id) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter(task => task.id !== id)
    }))
  }

  return (
    <div className="app">
      <header>
        <h1>Priority Task Manager</h1>
        <p>Organize your tasks by importance</p>
      </header>

      {/* Task Input Section */}
      <div className="task-input">
        <input
          type="text"
          value={newTask.text}
          onChange={(e) => setNewTask({...newTask, text: e.target.value})}
          placeholder="What needs to be done?"
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({...newTask, category: e.target.value})}
        >
          {categories.map(category => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <button onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* Categories Display */}
      <div className="categories-container">
        {categories.map(category => (
          <div 
            key={category.name} 
            className="category"
            style={{ borderTop: `4px solid ${category.color}` }}
          >
            <h2>{category.name}</h2>
            
            <div className="tasks-list">
              {tasks[category.name].length === 0 ? (
                <p className="empty-message">No tasks yet</p>
              ) : (
                tasks[category.name].map(task => (
                  <div 
                    key={task.id} 
                    className={`task ${task.completed ? 'completed' : ''}`}
                  >
                    <span onClick={() => toggleTask(category.name, task.id)}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(category.name, task.id)}
                      className="delete-btn"
                    >
                      ×
                    </button>
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