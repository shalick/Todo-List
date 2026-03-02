import { useState, useMemo, type ChangeEvent, type MouseEvent } from "react";
import "./App.css";

type Priority = "Low" | "Medium" | "High";

interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("Medium");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  const priorityWeight: Record<Priority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return b.createdAt - a.createdAt;
    });
  }, [todos, sortBy]);

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "date" | "priority");
  };

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriority(e.target.value as Priority);
  };

  const addTodo = () => {
    if (!task.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: task,
      isCompleted: false,
      priority: selectedPriority,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
    setTask("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  const deleteTodo = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>Task Manager</h1>

      <div className="input-group">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
        />
        <select value={selectedPriority} onChange={handlePriorityChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <ul>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`todo-item ${todo.priority.toLowerCase()}`}
          >
            <div className="view-mode">
              <div className="todo-info">
                <span
                  className={`priority-badge ${todo.priority.toLowerCase()}`}
                >
                  {todo.priority}
                </span>
                <span className={todo.isCompleted ? "completed" : ""}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={(e) => deleteTodo(e, todo.id)}
                className="del-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-task-list">Your task list is empty.</p>
      )}
    </div>
  );
}

export default App;
