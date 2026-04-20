import {useState, useEffect} from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ItineraryView from "./components/ItineraryView";
import SummaryPanel from "./components/SummaryPanel";
import './App.css';

const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Submit project report",
    desc: "Finalize and submit the project report to the professor.",
    priority: "High",
    dueDate: "2026-04-18",
    estimatedTime: 90,
    category: "School",
    completed: false
  },
  {
    id: "2",
    title: "Grocery shopping",
    desc: "Buy groceries for the week.",
    priority: "Medium",
    dueDate: "2026-04-20",
    estimatedTime: 60,
    category: "Personal",
    completed: false
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("priorify_tasks");
      return saved ? JSON.parse(saved) : SAMPLE_TASKS;
    } catch {
      return SAMPLE_TASKS;
    }
  });

  const [view, setView] = useState("tasks");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  //Auto-save to localStorage whenever theres a change
  useEffect(() => {
    try {
      localStorage.setItem("priorify_tasks", JSON.stringify(tasks));
    } catch {
      console.warn("Could not save to localStorage");
    }
  }, [tasks]);

  const handleAddTask = (formData) => {
    const newTask = {
      ...formData,
      id: crypto.randomUUID(),
      estimatedTime: Number(formData.estimatedTime),
      completed: false
    };
    setTasks((prev) => [...prev, newTask]);
    setShowForm(false);
  };

  const handleSaveEdit = (formData) => {
    setTasks((prev) => 
      prev.map((t) =>
        t.id === editingTask.id
          ? {...editingTask, ...formData, estimatedTime: Number(formData.estimatedTime)}
          : t
        )
    );
    setEditingTask(null);
  };

  const handleComplete = (id) => {
    setTasks((prev) => 
      prev.map((t) => (t.id === id ? {...t, completed: !t.completed} : t))
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleClearStorage = () => {
    if (window.confirm("Clear all data?")) {
      localStorage.removeItem("priorify_tasks");
      setTasks(SAMPLE_TASKS); 
    }
  }

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">Priorify</h1>
          <p className="app-subtitle">{remaining} task{remaining !== 1 ? "s" : ""} remaining</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => { setShowForm((v) => !v); setEditingTask(null); }}
        >
          {showForm ? "Cancel" : "+ Add Task"}
        </button>
      </header>

      {showForm && !editingTask && (
        <TaskForm onSave={handleAddTask} onCancel={() => setShowForm(false)} />
      )}
      {editingTask && (
        <TaskForm
          editing={editingTask}
          onSave={handleSaveEdit}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <div className="view-tabs">
        <button
          className={`tab ${view === "tasks" ? "active" : ""}`}
          onClick={() => setView("tasks")}
        >
          All Tasks
        </button>
        <button
          className={`tab ${view === "itinerary" ? "active" : ""}`}
          onClick={() => setView("itinerary")}
        >
          Daily Itinerary
        </button>
      </div>

      <div className="app-body">
        <SummaryPanel tasks={tasks} onClearStorage={handleClearStorage} />

        <div className="app-main">
            {view === "tasks" ? (
              <TaskList
                tasks={tasks}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ) : (
              <div className="card">
                <ItineraryView tasks={tasks} onComplete={handleComplete} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
