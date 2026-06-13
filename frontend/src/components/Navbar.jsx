import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/goals">Goals</Link> |{" "}
            <Link to="/skills">Skills</Link> |{" "}
            <Link to="/resources">Resources</Link>
        </nav>
    );
}
export default Navbar;
