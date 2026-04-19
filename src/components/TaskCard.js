export default function TaskCard({ task, onComplete, onEdit, onDelete }) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueDate = task.dueDate ? (() => {
    const [year, month, day] = task.dueDate.split("-").map(Number);
    return new Date(year, month - 1, day);
    })() : null;

    const isOverdue  = dueDate && !task.completed && dueDate < now;
    const isUpcoming = dueDate && !task.completed && dueDate.getTime() === now.getTime();

    let cardClass = `card task-card`;
    if (task.completed) cardClass += " task-completed";
    if (isOverdue)      cardClass += " task-card-overdue";
    if (isUpcoming)     cardClass += " task-card-upcoming";
    
    return (
        <div className={cardClass}>
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
                        <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.completed && <span className="badge badge-done">Done</span>}
                </div>
        
                <div className="task-meta">
                    {task.dueDate && (
                        <span className={isOverdue ? "overdue" : isUpcoming ? "upcoming" : ""}>
                            Due {task.dueDate}
                        </span>
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
                        if (window.confirm("Delete this task?")) onDelete(task.id);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}