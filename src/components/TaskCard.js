export default function TaskCard({ task, onComplete, onEdit, onDelete }) {
    const isOverdue = 
        task.dueDate && !task.compelted && new Date(task.dueData) < new Date();
    
    return (
        <div className={`card task-card ${task.completed ? "task-completed" : ""} ${isOverdue ? "task-overdue" : ""}`}>
            <div className="task-row">
                <div
                    className={`custom-checkbox ${task.completed ? "checked" : ""}`}
                    onClick={() => onComplete(task.id)}
                />

                <div className="task-body">
                    <div className="task-title-row">
                        <span className={`task-title ${task.completed ? "strikethrough" : ""}`}>
                            {task.title}
                        </span>
                        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        {task.completed && <span className="badge badge-Done">Done</span>}
                    </div>

                    <div className="task-meta">
                        {task.dueDate && (
                            <span className={isOverdue ? "overdue" : ""}> Due {task.dueDate}</span>
                        )}
                        {task.estimatedTime && <span>{task.estimatedTime} min</span>}
                        {task.category && (
                            <span className="category-pill">{task.category}</span>
                        )}
                    </div>
                </div>

                <div className="task-actions">
                    {!task.completed && (
                        <button className="btn btn-sm" onClick={() => onEdit(task)}>
                            Edit
                        </button>
                    )}
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                            if (window.confirm("Delete this task?")) {
                                onDelete(task.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}