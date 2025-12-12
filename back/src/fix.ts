
import Database from "better-sqlite3";

export default function fix() {
    const db = new Database("app.sqlite");

    try {
        // Check if column exists
        const row = db.prepare(`PRAGMA table_info(users)`).all();
        const hasPassword = row.some((col: any) => col.name === "password");

        if (!hasPassword) {
            console.log("Adding password column to users table...");
            db.prepare(`ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ''`).run();
            console.log("Migration complete.");
        } else {
            console.log("Password column already exists.");
        }

    } catch (err) {
        console.error("Migration failed:", err);
    }

    db.close();
}
