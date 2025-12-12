import { Router, Request, Response } from "express";
import { authenticate } from "./user";
import { addTodo, listTodosForUser, markTodoCompleted } from "./db";

const tasks = Router();

tasks.post("/", authenticate, (rq: Request, rs: Response) => {
    const userId = (rq as any).user.id;
    const { title } = rq.body;
    if (!title) return rs.status(400).send("Missing title");

    try {
        const info = addTodo.run({ user_id: userId, title });
        rs.status(201).json({ id: info.lastInsertRowid, userId, title, completed: 0 });
    } catch (err) {
        console.log(err);
        rs.status(500).send("Failed to create task");
    }
});

tasks.get("/", authenticate, (rq: Request, rs: Response) => {
    const userId = (rq as any).user.id;
    try {
        const list = listTodosForUser.all(userId);
        rs.json(list);
    } catch (err) {
        console.log(err);
        rs.status(500).send("Failed to fetch tasks");
    }
});

tasks.post("/:taskId/complete", authenticate, (rq: Request, rs: Response) => {
    const { taskId } = rq.params;
    try {
        const info = markTodoCompleted.run(Number(taskId));
        if (info.changes === 0) return rs.status(404).send("Task not found");
        rs.json({ message: "Task completed", taskId: Number(taskId) });
    } catch (err) {
        console.log(err);
        rs.status(500).send("Failed to complete task");
    }
});

export default tasks;
