
export function buildItinerary(tasks) {
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