import { Router, Request, Response } from "express";
import { authenticate } from "./user";
import { createCourse, db, enrollUser, getEnrollmentsCourse, getUserEnrollments, listCourses } from "./db";

const cours = Router();

cours.get("/", (_rq: Request, rs: Response) => {
    rs.json(listCourses.all());
});

cours.post("/", (rq: Request, rs: Response) => {
    const { title, description } = rq.body;
    if (!title || !description) return rs.status(400).send("Missing info");

    const info = createCourse.run({ title, description });
    rs.status(201).json({ id: info.lastInsertRowid, title, description });
});

cours.delete("/:courseId", authenticate, (rq: Request, rs: Response) => {
    const { courseId } = rq.params;
    const result = db.prepare("DELETE FROM courses WHERE id = ?").run(Number(courseId));
    if (result.changes === 0) return rs.status(404).send("Course not found");
    rs.json({ message: "Course deleted" });
});

cours.post("/:courseId/enroll", authenticate, (rq: Request, rs: Response) => {
    const { courseId } = rq.params;
    const userId = (rq as any).user.id;

    try {
        const info = enrollUser.run({ user_id: userId, course_id: Number(courseId) });
        rs.status(201).json({ enrollmentId: info.lastInsertRowid, userId, courseId });
    } catch (err: any) {
        if (err.message.includes("UNIQUE")) return rs.status(409).send("Already enrolled");
        console.log(err);
        rs.status(500).send("Enrollment failed");
    }
});

cours.get("/:courseId/students", authenticate, (rq: Request, rs: Response) => {
    const { courseId } = rq.params;
    const students = getEnrollmentsCourse.all(Number(courseId));
    rs.json(students);
});

cours.get("/user", authenticate, (rq: Request, rs: Response) => {

    const userId = (rq as any).user.id;
    if (!userId) return rs.status(400).send("Missing userId");

    try {
        const list = getUserEnrollments.all(Number(userId));
        rs.json(list);
    } catch (err) {
        console.log(err);
        rs.status(500).send("Failed to fetch enrolled courses");
    }
});

export default cours;
