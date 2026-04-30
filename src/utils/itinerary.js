//Pulled this into its own file

//How to schedule:
// 1. Filter out completed tasks
// 2. Score each task by priority (high=3, medium=2, low=1) + urgency (due date)
// 3. Sort by score descending
// 4. Greedily fill an 8-hour day (480 mins), skip tasks that dont fit

export function buildItinerary(tasks) {
    const today = new Date();
    const activeTasks = tasks.filter((t) => !t.completed);

    //Urgency Score -> 10 Days left or more == 0 | Increases linearly with proximity
    //Priority Score -> Direct map { H: 3, M:2, L:1, UN:1} *UN is unprioritized
    //Total score = priorityScore * 2 + urgencyScore;
    //Priority is 2x as important as urgency
    const scored = activeTasks.map((task) => {
        const daysLeft = task.dueDate
            ? (new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24)
            : 999;
        const priorityScore = { High: 3, Medium: 2, Low: 1 }[task.priority] || 1;
        const urgencyScore = Math.max(0, 10 - daysLeft);
        return {...task, score: priorityScore * 2 + urgencyScore};
    });

    scored.sort((a, b) => b.score - a.score);

    //Fill out an 8 hour day
    let minutesLeft = 480; //8 hours
    let currentMinute = 9 * 60; //Start at 9:00 AM
    const slots = [];

    //Greedy alg
    for (const task of scored) {
        //If we have time to do *this* current task...
        if (task.estimatedTime <= minutesLeft) {
            //Get start and end time
            const startH = Math.floor(currentMinute / 60);
            const startM = currentMinute % 60;
            const endMinute = currentMinute + Number(task.estimatedTime);
            const endH = Math.floor(endMinute / 60);
            const endM = endMinute % 60;

            //Time formatting helper func
            const fmt = (h, m) => {
                const period = h < 12 ? "AM" : "PM";
                const displayH = h % 12 || 12;
                return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
            };

            //Add to slots
            slots.push({
                ...task,
                startLabel: fmt(startH, startM),
                endLabel: fmt(endH, endM)
            });

            //Update variables
            currentMinute = endMinute;
            minutesLeft -= Number(task.estimatedTime);
        }
    }

    return slots;
}