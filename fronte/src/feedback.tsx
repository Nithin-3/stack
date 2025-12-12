import { useEffect, useState } from "react";
import axios from "axios";
import "./feedback.css"

interface Course {
    id: number;
    title: string;
}

interface Feedback {
    id: number;
    user_id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function FeedbackPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("usr");

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}courses`)
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        axios.get(`${process.env.REACT_APP_URL}feedback/${selectedCourse}`).then(res => setFeedbacks(res.data))
            .catch(err => console.error(err));
    }, [selectedCourse]);

    const submitFeedback = async () => {
        if (!token) return setError("You must be logged in");

        if (!selectedCourse) return setError("Select a course");
        if (rating < 1 || rating > 5) return setError("Rating must be 1-5");

        try {
            const res = await axios.post(`${process.env.REACT_APP_URL}feedback`, { courseId: selectedCourse, rating, comment }, { headers: { authorization: token } });
            setFeedbacks([res.data, ...feedbacks]);
            setComment("");
            setRating(5);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to submit feedback");
        }
    };

    return (
        <div className="feedback-page">
            <h2>Feedback</h2>

            {error && <div className="error">{error}</div>}

            <label>
                Select Course:
                <select value={selectedCourse || ""} onChange={(e) => setSelectedCourse(Number(e.target.value))} >
                    <option value="">-- Select a course --</option>
                    {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>
            </label>

            <div className="feedback-form">
                <label>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>

                <textarea placeholder="Your comment..." value={comment} onChange={(e) => setComment(e.target.value)} />

                <button onClick={submitFeedback}>Submit Feedback</button>
            </div>

            <hr />

            <h3>All Feedback</h3>
            {feedbacks.length === 0 ? (
                <p>No feedback yet.</p>
            ) : (
                feedbacks.map(f => (
                    <div key={f.id} className="feedback-card">
                        <strong>{f.user_name}</strong> rated {f.rating}/5
                        <p>{f.comment}</p>
                        <small>{new Date(f.created_at).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
}
