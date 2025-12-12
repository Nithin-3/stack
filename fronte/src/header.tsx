import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
    const { pathname } = useLocation();
    const [usr, setUsr] = useState<any>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("usr");
        if (!token) {
            setUsr(null);
            return;
        }

        axios.get(`${process.env.REACT_APP_URL}user/me`, { headers: { authorization: token } }).then(res => setUsr(res.data))
            .catch(() => setUsr(null));

    }, []);

    return (
        <header>
            <div>stack</div>

            <nav className={open ? "open" : ""}>
                <Link className={pathname === "/" ? "on" : ""} to="/" onClick={() => setOpen(false)}>courses</Link>
                <Link className={pathname === "/feedback" ? "on" : ""} to="/feedback" onClick={() => setOpen(false)}>feedback</Link>
                <Link className={pathname === "/task" ? "on" : ""} to="/task" onClick={() => setOpen(false)}>task</Link>
                <Link className={pathname === (usr ? "/usr" : "/acc") ? "on" : ""} to={usr ? "/usr" : "/acc"} onClick={() => setOpen(false)} > {usr?.name || "login"} </Link>
            </nav>

            <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>
        </header>
    );
}
