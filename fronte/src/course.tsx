import axios from "axios";
import { useEffect, useState } from "react";
import "./course.css"

export default function Courses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolls, setEnrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("usr");

    useEffect(() => {
        const load = async () => {
            try {
                const e = await axios.get(`${process.env.REACT_APP_URL}courses/user`, { headers: { authorization: userId } });
                setEnrolls(e.data);
                console.log(e.data)

                const c = await axios.get(`${process.env.REACT_APP_URL}courses`);
                setCourses(c.data);

            } catch (err) {
                console.log(err);
                setError("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [userId]);

    const enroll = async (courseId: number) => {
        try {
            await axios.post(`${process.env.REACT_APP_URL}courses/${courseId}/enroll`, {}, { headers: { authorization: userId } });
            setEnrolls(prev => [...prev, { course_id: courseId }]);
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("Already enrolled");
            } else {
                alert("Failed to enroll");
            }
        }
    };

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="courses-container">
            {!userId && (
                <div className="no-user-box">
                    No user found — <span>Login</span>
                </div>
            )}

            <h2>Courses</h2>

            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                courses.map((c: any) => {
                    const isEnrolled = enrolls.some(
                        (v: any) => v.course_id === c.id
                    );

                    return (
                        <div className="course-card" key={c.id}>
                            <h3>{c.title}</h3>
                            <p>{c.description}</p>

                            {isEnrolled ? (
                                <span className="enrolled">Enrolled</span>
                            ) : (
                                <button onClick={() => enroll(c.id)}>
                                    Enroll
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
