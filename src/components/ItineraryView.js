
//Definition
export default function ItineraryView({ tasks, onComplete, onBuild, hasItinerary }) {
    //Total time for all tasks
    const totalMins = tasks.reduce((sum, t) => sum + Number(t.estimatedTime), 0);

    //Empty state for the itinerary
    if (tasks.length === 0 && hasItinerary) {
        return <p className="empty-state">No active tasks to schedule.</p>;
    }

    //Allows the user to build an itinerary
    if (!hasItinerary) {
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                No itinerary built yet for today.
            </p>
            <button className="btn btn-primary" onClick={onBuild}>
                Build itinerary
            </button>
            </div>
        );
    }

    //HTML
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                <button className="btn" onClick={onBuild}>
                    Rebuild
                </button>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Tasks scheduled</div>
                    <div className="stat-value">{tasks.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total time</div>
                    <div className="stat-value">
                        {(totalMins / 60).toFixed(1)} hrs
                    </div>
                </div>
            </div>

            <div className="itinerary-list">
                {tasks.map((task) => (
                    <div key={task.id} className={`itinerary-slot ${task.completed ? "itinerary-slot-done" : ""}`}>
                        <div
                            className={`custom-checkbox ${task.completed ? "checked" : ""}`}
                            onClick={() => onComplete(task.id)}
                        />
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