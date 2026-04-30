//Main use function
export default function SummaryPanel({tasks, onClearStorage}) {
    //Get reference to now as date/time
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    //Get active jobs (uncompleted)
    const active = tasks.filter((t) => !t.completed);

    //Helper function to parse date string to a Date obj
    const parseDate = (str) => {
        const [year, month, day] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    //Helper function for overdue tasks
    const isOverdue = (t) => {
        if (!t.dueDate) return false;
        return parseDate(t.dueDate) < now;
    };

    //Helper function for upcoming tasks
    const isUpcoming = (t) => {
        if (!t.dueDate) return false;
        return parseDate(t.dueDate).getTime() === now.getTime();
    };

    //Generate stats for summary
    const stats = {
        total:    tasks.length,
        high:     active.filter((t) => t.priority.toLowerCase() === "high").length,
        medium:   active.filter((t) => t.priority.toLowerCase() === "medium").length,
        low:      active.filter((t) => t.priority.toLowerCase() === "low").length,
        overdue:  active.filter(isOverdue).length,
        upcoming: active.filter(isUpcoming).length,
    };

    //HTML
    return (
        <aside className="summary-panel">
        <div className="summary-title">Summary</div>
    
        <div className="summary-item">
            <span className="summary-label">Total tasks</span>
            <span className="summary-value">{stats.total}</span>
        </div>
    
        <div className="summary-divider" />
    
        <div className="summary-item">
            <span className="summary-label summary-high">High</span>
            <span className="summary-value summary-high">{stats.high}</span>
        </div>
        <div className="summary-item">
            <span className="summary-label summary-medium">Medium</span>
            <span className="summary-value summary-medium">{stats.medium}</span>
        </div>
        <div className="summary-item">
            <span className="summary-label summary-low">Low</span>
            <span className="summary-value summary-low">{stats.low}</span>
        </div>
    
        <div className="summary-divider" />
    
        <div className="summary-item">
            <span className="summary-label summary-overdue">Overdue</span>
            <span className="summary-value summary-overdue">{stats.overdue}</span>
        </div>
        <div className="summary-item">
            <span className="summary-label summary-upcoming">Upcoming</span>
            <span className="summary-value summary-upcoming">{stats.upcoming}</span>
        </div>
    
        <div className="summary-divider" />
    
        <button
            className="btn btn-danger btn-clear"
            onClick={() => {
            if (window.confirm("Clear all tasks? This cannot be undone.")) {
                onClearStorage();
            }
            }}
        >
            Clear all data
        </button>
        </aside>
    );
}