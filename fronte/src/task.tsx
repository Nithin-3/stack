import { useEffect, useState } from "react";
import axios from "axios";
import "./task.css"

interface Task {
    id: number;
    title: string;
    completed: boolean | number;
    created_at: string;
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("usr");

    const loadTasks = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${process.env.REACT_APP_URL}tasks`, {
                headers: { authorization: token }
            });
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async () => {
        if (!token) return setError("You must be logged in");
        if (!newTask.trim()) return setError("Task title required");

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_URL}tasks`,
                { title: newTask },
                { headers: { authorization: token } }
            );
            setTasks([res.data, ...tasks]);
            setNewTask("");
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to add task");
        }
    };

    const completeTask = async (taskId: number) => {
        if (!token) return;
        try {
            await axios.post(
                `${process.env.REACT_APP_URL}tasks/${taskId}/complete`,
                {},
                { headers: { authorization: token } }
            );
            setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
        } catch (err) {
            console.error(err);
            setError("Failed to complete task");
        }
    };

    if (loading) return <p>Loading tasks...</p>;

    return (
        <div className="task-page">
            <h2>Your Tasks</h2>

            {error && <div className="error">{error}</div>}

            <div className="task-form">
                <input
                    type="text"
                    placeholder="New task title"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <ul className="task-list">
                {tasks.length === 0 ? (
                    <p>No tasks yet.</p>
                ) : (
                    tasks.map(t => (
                        <li key={t.id} className={t.completed ? "completed" : ""}>
                            <span>{t.title}</span>
                            {!t.completed && (
                                <button onClick={() => completeTask(t.id)}>Complete</button>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
