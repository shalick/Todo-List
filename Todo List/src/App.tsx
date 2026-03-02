import { useState, useMemo, type ChangeEvent } from "react";
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
  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  return (
    <>
      <div>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
        />
        <select
          value={selectedPriority}
          onChange={handlePriorityChange}
          className="border p-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <label>Sort by:</label>
        <select onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <ul>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              textDecoration: todo.isCompleted ? "line-through" : "none",
              color: todo.isCompleted ? "gray" : "black",
              cursor: "pointer",
            }}
          >
            <span>
              <strong>[{todo.priority}]</strong> {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
