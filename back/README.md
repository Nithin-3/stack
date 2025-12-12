## Features

User authentication (signup/login) with JWT

Courses management: create, list, delete, enroll users

Feedback submission & retrieval

User tasks (todos)

SQLite database with foreign key constraints

### Routes
## User / Auth

POST /user/ – create new user

POST /user/login – login user and return JWT

GET /user/me – get logged-in user info (requires JWT)

## Courses

GET /courses – list all courses

POST /courses – create a new course

DELETE /courses/:courseId – delete a course

POST /courses/:courseId/enroll – enroll user in a course (requires JWT)

GET /courses/:courseId/students – list enrolled users for a course

GET /courses/user/:userId – list courses a user is enrolled in (requires JWT)

## Feedback

GET /feedback/:courseId – list feedback for a course

GET /feedback – list all feedback

POST /feedback – submit feedback (requires JWT)

Fields: courseId, rating (1–5), comment (optional)

## Tasks / Todos

GET /tasks – list user tasks (requires JWT)

POST /tasks – create a new task (requires JWT)

POST /tasks/:taskId/complete – mark task as complete (requires JWT)


---
## Database Tables

`users` – id, name, email, password, created_at

`courses` – id, title, description, created_at

`feedback` – id, user_id, course_id, rating, comment, created_at

`todos` – id, user_id, title, completed, created_at

`enrollments` – id, user_id, course_id, created_at

---
## Database Functions

`Users:` createUser, getUserById, listUsers

`Courses:` createCourse, listCourses

`Feedback:` addFeedback, listFeedback, listAllFeedback

`Todos:` addTodo, listTodosForUser, markTodoCompleted

`Enrollments:` enrollUser, getEnrollmentsCourse, getUserEnrollments

## Authentication

`JWT` stored in Authorization header for protected routes

Passwords hashed with `bcrypt` during signup

Notes

Foreign keys enabled in `SQLite` for cascading deletes

`Unique constraints:` email for users, (user_id, course_id) for enrollments

`Supports seeding random courses, users, feedback, and tasks for testing`
