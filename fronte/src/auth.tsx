import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"

export default function Auth() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const toggle = () => setMode(mode === "login" ? "register" : "login");

    const nav = useNavigate();

    const login = async () => {
        setError("");
        try {
            const res = await axios.post(`${process.env.REACT_APP_URL}user/login`, { email, password });
            localStorage.setItem("usr", `barrer ${res.data}`);
            nav("/")
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    const register = async () => {
        setError("");
        try {
            const res = await axios.post(`${process.env.REACT_APP_URL}user/`, { name, email, password });
            localStorage.setItem("usr", `barrer ${res.data}`);
            nav("/")
        } catch (err) {
            setError("Email already exists");
        }
    };

    return (
        <div className="auth-container">
            <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

            {error && <div className="auth-error">{error}</div>}

            {mode === "register" && (
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {mode === "login" ? (
                <button onClick={login}>Login</button>
            ) : (
                <button onClick={register}>Create Account</button>
            )}

            <p className="switcher" onClick={toggle}>
                {mode === "login"
                    ? "Don't have an account? Create one"
                    : "Already have an account? Login"}
            </p>
        </div>
    );
}
