import axios from "axios";
import { useEffect, useState } from "react";
import "./usr.css"

interface Course {
    course_id: number;
    title: string;
    description: string;
    created_at: string;
    enrolled_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Usr() {
    const [usr, setUsr] = useState<User | null>(null);
    const [enrolls, setEnrolls] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("usr");
        if (!token) {
            setUsr(null);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_URL}user/me`, { headers: { authorization: token } });
                setUsr(res.data);

                const eRes = await axios.get(`${process.env.REACT_APP_URL}courses/user`, { headers: { authorization: token } });
                setEnrolls(eRes.data);

            } catch (err) {
                console.error(err);
                setError("Failed to load user info or enrollments");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Loading user info...</p>;
    if (error) return <p>{error}</p>;
    if (!usr) return <p>No user logged in</p>;

    return (
        <div className="user-page">
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {usr.name}</p>
            <p><strong>Email:</strong> {usr.email}</p>

            <h3>Enrolled Courses</h3>
            {enrolls.length === 0 ? (
                <p>You have not enrolled in any courses yet.</p>
            ) : (
                <ul>
                    {enrolls.map(c => (
                        <li key={c.course_id}>
                            <strong>{c.title}</strong> — enrolled at {new Date(c.enrolled_at).toLocaleString()}
                            <p>{c.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
