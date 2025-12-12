import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserById, listUsers } from "./db";

const users = Router();
const JWT_SECRET = "hbsdk239884923^%&^*&%$%ugvwevu23";
const SALT_ROUNDS = 10;

users.post("/", async (rq: Request, rs: Response) => {
    const { name, email, password } = rq.body;
    if (!name || !email || !password) return rs.status(400).send("Missing fields");

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const info = createUser.run({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: info.lastInsertRowid, name, email }, JWT_SECRET, { expiresIn: "1h" });
        rs.status(201).send(token);
    } catch (err: any) {
        if (err.message.includes("UNIQUE")) return rs.status(409).send("Email exists");
        console.log(err);
        rs.status(500).send("Failed to create user");
    }
});

users.post("/login", async (rq: Request, rs: Response) => {
    const { email, password } = rq.body;
    if (!email || !password) return rs.status(400).send("Missing fields");

    try {
        const user = listUsers.all().find((u: any) => u.email === email) as any;
        if (!user) return rs.status(404).send("User not found");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return rs.status(401).send("Invalid credentials");

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        rs.send(token);
    } catch (err) {
        console.log(err);
        rs.status(500).send("Login failed");
    }
});

const authenticate = (rq: Request, rs: Response, next: Function) => {
    const authHeader = rq.headers.authorization;
    if (!authHeader) return rs.status(401).send("Missing Authorization header");

    const token = authHeader.split(" ")[1];
    if (!token) return rs.status(401).send("Missing token");

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        (rq as any).user = payload;
        next();
    } catch {
        rs.status(401).send("Invalid token");
    }
};

users.get("/me", authenticate, (rq: Request, rs: Response) => {
    const userId = (rq as any).user.id;
    const user = getUserById.get(userId);
    if (!user) return rs.status(404).send("User not found");

    const { password, ...safeUser } = user as any;
    rs.json(safeUser);
});

export default users;
export { authenticate };
