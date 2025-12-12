import { Router, Request, Response } from "express";
import { authenticate } from "./user";
import { addFeedback, listAllFeedback, listFeedback } from "./db";

const feed = Router();

feed.post("/", authenticate, (rq: Request, rs: Response) => {
    const userId = (rq as any).user.id;
    const { courseId, rating, comment } = rq.body;

    if (!courseId || !rating) return rs.status(400).send("Missing courseId or rating");
    if (rating < 1 || rating > 5) return rs.status(400).send("Rating must be 1-5");

    try {
        const info = addFeedback.run({ user_id: userId, course_id: courseId, rating, comment });
        rs.status(201).json({ id: info.lastInsertRowid, userId, courseId, rating, comment });
    } catch (err) {
        console.error(err);
        rs.status(500).send("Failed to submit feedback");
    }
});

feed.get("/", (_rq: Request, rs: Response) => {
    rs.json(listAllFeedback.all());
});

feed.get("/:courseId", (rq: Request, rs: Response) => {
    rs.json(listFeedback.all(Number(rq.params.courseId)));
});

export default feed;
