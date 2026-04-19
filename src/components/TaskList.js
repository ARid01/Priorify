import { useState } from "react";
import TaskCard from "./TaskCard";

const PRIORITIES = ['high', 'medium', 'low'];
const priorityColors = {high: 'tab-high', medium: 'tab-medium', low: 'tab-low'};
const priorityClasses = {high: 'active-high', medium: 'active-medium', low: 'active-low'};

export default function TaskList({ tasks, onComplete, onEdit, onDelete }) {
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("priority");

    //Build category list dynamically from tasks
    const categories = ["all", ...new Set(tasks.map((t) => t.category).filter(Boolean))];

    const visibleTasks = tasks
        .filter((t) => filter === "all" || t.category === filter || t.priority === filter)
        .sort((a, b) => {
            if (sort === "priority-htl") {
                const order = {high: 0, medium: 1, low: 2};
                return order[a.priority] - order[b.priority];
            }
            else if (sort === "priority-lth") {
                const order = {high: 2, medium: 1, low: 0};
                return order[a.priority] - order[b.priority];
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
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`tab ${filter === cat ? "active" : ""}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                    {PRIORITIES.map((p) => (
                        <button
                            key={p}
                            className={`tab ${priorityColors[p] || "" } ${filter === p ? (priorityClasses[p] || "active") : ""}`}
                            onClick={() => setFilter(p)}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
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