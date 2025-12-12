import Database from "better-sqlite3";
// import fix from "./fix";
// fix()
export const db = new Database("app.sqlite");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
`);

export const createUser = db.prepare(`
  INSERT INTO users (name, email, password)
  VALUES (@name, @email, @password)
`);

export const getUserById = db.prepare(`
  SELECT * FROM users WHERE id = ?
`);

export const listUsers = db.prepare(`
  SELECT * FROM users ORDER BY id DESC
`);

export const createCourse = db.prepare(`
  INSERT INTO courses (title, description)
  VALUES (@title, @description)
`);

export const listCourses = db.prepare(`
  SELECT * FROM courses ORDER BY id DESC
`);

export const addFeedback = db.prepare(`
  INSERT INTO feedback (user_id, course_id, rating, comment)
  VALUES (@user_id, @course_id, @rating, @comment)
`);

export const listFeedback = db.prepare(`
  SELECT f.*, u.name AS user_name
  FROM feedback f
  JOIN users u ON f.user_id = u.id
  WHERE f.course_id = ?
  ORDER BY f.id DESC
`);

export const listAllFeedback = db.prepare(`
  SELECT 
    f.id,
    f.rating,
    f.comment,
    f.created_at,
    u.id AS user_id,
    u.name AS user_name,
    c.id AS course_id,
    c.title AS course_title
  FROM feedback f
  JOIN users u ON f.user_id = u.id
  JOIN courses c ON f.course_id = c.id
  ORDER BY f.id DESC
`);

export const addTodo = db.prepare(`
  INSERT INTO todos (user_id, title)
  VALUES (@user_id, @title)
`);

export const listTodosForUser = db.prepare(`
  SELECT * FROM todos
  WHERE user_id = ?
  ORDER BY id DESC
`);

export const markTodoCompleted = db.prepare(`
  UPDATE todos SET completed = 1 WHERE id = ?
`);

export const enrollUser = db.prepare(`
  INSERT INTO enrollments (user_id, course_id)
  VALUES (@user_id, @course_id)
`);

export const getEnrollmentsCourse = db.prepare(`
  SELECT e.id, e.created_at, u.id AS user_id, u.name, u.email
  FROM enrollments e
  JOIN users u ON e.user_id = u.id
  WHERE e.course_id = ?
  ORDER BY e.id DESC
`);


export const getUserEnrollments = db.prepare(`
  SELECT 
    c.id AS course_id,
    c.title,
    c.description,
    c.created_at,
    e.created_at AS enrolled_at
  FROM enrollments e
  JOIN courses c ON c.id = e.course_id
  WHERE e.user_id = ?
  ORDER BY e.id DESC
`);



// const seed = db.prepare(`
//         INSERT INTO courses (title, description)
//         VALUES
//         ('JavaScript Basics', 'Learn the fundamentals of JavaScript programming.'),
//         ('Advanced JavaScript', 'Deep dive into closures, prototypes, and async.'),
//         ('React Fundamentals', 'Introduction to components, hooks, and JSX.'),
//         ('React Advanced Patterns', 'Context, reducers, optimization, and architecture.'),
//         ('Node.js API Development', 'Build REST APIs using Express and middleware.'),
//         ('TypeScript Essentials', 'Learn strong typing, interfaces, and generics.'),
//         ('SQL Essentials', 'Master basic SQL queries, joins, and constraints.'),
//         ('Advanced SQL & Optimization', 'Indexes, query optimization, and transactions.'),
//         ('Docker for Developers', 'Learn containers, images, and environment management.'),
//         ('Git & GitHub Mastery', 'Branching, merging, workflows, and collaboration.');
//     `);
//
// seed.run();
// console.log("Seeded 10 default courses ✔️");

//
//
// const courses = listCourses.all() as any;
// const users = listUsers.all() as any;
//
// if (courses.length === 0 || users.length === 0) {
//     console.log("No courses or users available for feedback");
//     process.exit(0);
// }
//
// // Some random comments
// const comments = [
//     "Great course!",
//     "Very helpful content.",
//     "Could be better explained.",
//     "Loved it, highly recommend!",
//     "Not bad, but a bit short.",
//     "Excellent examples.",
//     "Too fast paced for beginners.",
//     "I learned a lot!",
//     "Instructor was very clear.",
//     "Would take another course from this author."
// ];
//
// function randomInt(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
//
// // Insert 10 random feedbacks
// for (let i = 0; i < 10; i++) {
//     const user = users[randomInt(0, users.length - 1)];
//     const course = courses[randomInt(0, courses.length - 1)];
//     const rating = randomInt(1, 5);
//     const comment = comments[randomInt(0, comments.length - 1)];
//
//     addFeedback.run({
//         user_id: user.id,
//         course_id: course.id,
//         rating,
//         comment
//     });
// }
//
// console.log("Inserted 10 random feedbacks successfully!");
//
