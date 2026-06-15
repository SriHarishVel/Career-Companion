import { Link } from "react-router-dom";
import "./index.css";

function Navbar() {
    return (
        <nav>
            <h2>Career Companion</h2>

            <Link to="/">Home</Link>
            <Link to="/goals">Goals</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/dashboard">Dashboard</Link>
        </nav>
    );
}   
export default Navbar;
    