import express from "express";
import cors from "cors";
import users from "./user";
import courses from "./courses";
import feedback from "./feedback";
import tasks from "./todo";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", users);
app.use("/courses", courses);
app.use("/feedback", feedback);
app.use("/tasks", tasks);

app.listen(300);
