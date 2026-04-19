import { useState } from "react";
import TaskCard from "./TaskCard";

const PRIORITIES = ['all', 'high', 'medium', 'low'];
const priorityColors = {high: 'tab-high', medium: 'tab-medium', low: 'tab-low'};
const priorityActives = {high: 'active-high', medium: 'active-medium', low: 'active-low'};

export default function TaskList({ tasks, onComplete, onEdit, onDelete }) {
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("priority");

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const parseDate = (str) => {
        const [year, month, day] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const isOverdue = (t) => {
        if (!t.dueDate || t.completed) return false;
        return parseDate(t.dueDate) < now;
    };

    const isUpcoming = (t) => {
        if (!t.dueDate || t.completed) return false;
        return parseDate(t.dueDate).getTime() === now.getTime();
    };

    const userCategories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

    const visibleTasks = tasks
        .filter((t) => {
            if (filter === "all")      return true;
            if (filter === "overdue")  return isOverdue(t);
            if (filter === "upcoming") return isUpcoming(t);
            if (PRIORITIES.includes(filter)) return t.priority.toLowerCase() === filter;
            return t.category === filter;
        })
        .sort((a, b) => {
            if (sort === "priority-htl") {
                const order = {high: 0, medium: 1, low: 2};
                return (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3);
            }
            else if (sort === "priority-lth") {
                const order = {high: 2, medium: 1, low: 0};
                return (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3);
            }
            else if (sort === "dueDate") {
                return (a.dueDate || "9999") < (b.dueDate || "9999") ? -1 : 1;
            }
            else if (sort === "estTime-asc") {
                return a.estimatedTime - b.estimatedTime;
            }
            else if (sort === "estTime-desc") {
                return b.estimatedTime - a.estimatedTime;
            }
            else {
                //Fallback (default to high priority to low priority)
                const order = {high: 0, medium: 1, low: 2};
                return order[a.priority] - order[b.priority];
            }
        });
    
    const activeTasks = visibleTasks.filter((t) => !t.completed);
    const completedTasks = visibleTasks.filter((t) => t.completed);

    return (
        <div>
            <div className="list-controls">
                <div className="tab-group">
                    {PRIORITIES.map((p) => (
                        <button
                            key={p}
                            className={`tab ${priorityColors[p] || ""} ${filter === p ? (priorityActives[p] || "active") : ""}`}
                            onClick={() => setFilter(p)}
                        >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}

                    {userCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`tab ${filter === cat ? "active" : ""}`}
                            onClick={() => setFilter(cat)}
                        >
                        {cat}
                        </button>
                    ))}

                    <button
                        className={`tab tab-overdue-filter ${filter === "overdue" ? "active-overdue" : ""}`}
                        onClick={() => setFilter("overdue")}
                    >
                        Overdue
                    </button>
                    <button
                        className={`tab tab-upcoming-filter ${filter === "upcoming" ? "active-upcoming" : ""}`}
                        onClick={() => setFilter("upcoming")}
                    >
                        Upcoming
                    </button>
                </div>

                <div className="sort-control">
                    <label>Sort by</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="priority-htl">Priority (High-&gt;Low)</option>
                        <option value="priority-lth">Priority (Low-&gt;High)</option>
                        <option value="dueDate">Due Date</option>
                        <option value="estTime-asc">Est. Time (Asc.)</option>
                        <option value="estTime-desc">Est. Time (Desc.)</option>
                    </select>
                </div>
            </div>

            {activeTasks.length === 0 && completedTasks.length === 0 && (
                <p className="empty-state">No tasks yet, add one above!</p>
            )}

            {activeTasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}

            {completedTasks.length > 0 && (
                <>
                <p className="section-label">Completed ({completedTasks.length})</p>
                {completedTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        />
                    ))}
                </>
            )}
        </div>
    );
}