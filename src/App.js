import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {

  const [showAddTask, setShowAddTask] = useState(false) // used to toggle 'Add" task button to 'Close Add".

  const [ tasks, setTasks ] = useState([])  // List of tasks. Stored on json server. See: Notes.txt

  // Called after Tasks component Mounts. Used to initialize task list.
  // Passing empty array disables the following effects: Updates, and UnMount.
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Returns an array of tasks.
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json();
    return data
  }

  // Returns task object with matcing id property.
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json();
    return data
  }

  // Posts a new task to the data base
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, 
    {
      method:'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()  // just returns added data
    setTasks([...tasks, data])
  }

  // Removes task from data base
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, 
    {
      method: 'DELETE'
    })

    setTasks(tasks.filter( task => task.id !== id))
  }

  // Toggles true=on/false=off the reminder feature
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method:'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map( task => id === task.id ? 
      {...task, reminder:data.reminder} : task ))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> :
           'The Task List is Empty'}
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}



export default App;
