import {useState} from "react";

const PRIORITIES = ["high", "medium", "low"];

const BLANK = {
    title: "",
    desc: "",
    priority: "low",
    dueDate: "",
    estimatedTime: 30,
    category: ""
}

export default function TaskForm({ onSave, onCancel, editing }) {
    const [form, setForm] = useState(editing || BLANK);

    const handleChange = (key) => (e) => {
        setForm((prev) => ({...prev, [key]: e.target.value}));
    };

    const handleSubmit = () => {
        if (!form.title.trim()) return;
        onSave(form);
    };

    return (
        <div className="card form-card">
            <div className="form-grid">
                <div className="form-full">
                    <label>Task title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={handleChange("title")}
                        placeholder="What needs to get done?"
                    />
                </div>

                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={form.desc}
                        onChange={handleChange("desc")}
                        placeholder="Add a description..."
                    />
                </div>

                <div>
                    <label>Priority</label>
                    <select value={form.priority} onChange={handleChange("priority")}>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Due date</label>
                    <input
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange("dueDate")}
                    />
                </div>

                <div>
                    <label>Estimated time (minutes)</label>
                    <input
                        type="number"
                        min="5"
                        max="480"
                        value={form.estimatedTime}
                        onChange={handleChange("estimatedTime")}
                    />
                </div>

                <div>
                    <label>Category</label>
                    <input
                        value={form.category}
                        onChange={handleChange("category")}
                        placeholder="e.g. Work, School, Personal..."
                    />
                </div>
            </div>

            <div className="form-actions">
                <button className="btn" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {editing ? "Save Changes" : "Add Task"}
                </button>
            </div>
        </div>
    );
}