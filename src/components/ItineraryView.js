//How to schedule:
// 1. Filter out completed tasks
// 2. Score each task by priority (high=3, medium=2, low=1) + urgency (due date)
// 3. Sort by score descending
// 4. Greedily fill an 8-hour day (480 mins), skip tasks that dont fit

function buildItinerary(tasks) {
    const today = new Date();
    const activeTasks = tasks.filter((t) => !t.completed);

    const scored = activeTasks.map((task) => {
        const daysLeft = task.dueDate
            ? (new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24)
            : 999;
        const priorityScore = { High: 3, Medium: 2, Low: 1 }[task.priority] || 1;
        const urgencyScore = Math.max(0, 10 - daysLeft);
        return {...task, score: priorityScore * 2 + urgencyScore};
    });

    scored.sort((a, b) => b.score - a.score);

    let minutesLeft = 480; //8 hours
    let currentMinute = 9 * 60; //Start at 9:00 AM
    const slots = [];

    for (const task of scored) {
        if (task.estimatedTime <= minutesLeft) {
            const startH = Math.floor(currentMinute / 60);
            const startM = currentMinute % 60;
            const endMinute = currentMinute + Number(task.estimatedTime);
            const endH = Math.floor(endMinute / 60);
            const endM = endMinute % 60;

            const fmt = (h, m) => {
                const period = h < 12 ? "AM" : "PM";
                const displayH = h % 12 || 12;
                return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
            };

            slots.push({
                ...task,
                startLabel: fmt(startH, startM),
                endLabel: fmt(endH, endM)
            });

            currentMinute = endMinute;
            minutesLeft -= Number(task.estimatedTime);
        }
    }

    return slots;
}

export default function ItineraryView({ tasks }) {
    const slots = buildItinerary(tasks);
    const totalMins = slots.reduce((sum, t) => sum + Number(t.estimatedTime), 0);

    if (slots.length === 0) {
        return (
            <p className="empty-state">No active tasks to schedule.</p>
        );
    }

    return (
        <div>
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Tasks scheduled</div>
                    <div className="stat-value">{slots.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total time</div>
                    <div className="stat-value">
                        {(totalMins / 60).toFixed(1)} hrs
                    </div>
                </div>
            </div>

            <div className="itinerary-list">
                {slots.map((task) => (
                    <div key={task.id} className="itinerary-slot">
                        <div className="time-block">
                            <span className="time-start">{task.startLabel}</span>
                            <span className="time-end">{task.endLabel}</span>
                        </div>
                        <div className="slot-body">
                            <div className="slot-title">{task.title}</div>
                            <div className="slot-meta">
                                <span className={`badge badge-${task.priority.toLowerCase()}`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                {task.category && (
                                    <span className="slot-category">{task.category}</span>
                                )}
                                <span className="slot-duration">{task.estimatedTime} min</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}