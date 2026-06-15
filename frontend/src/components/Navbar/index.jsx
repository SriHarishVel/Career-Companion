import { NavLink } from "react-router-dom";
import "./index.css";

function Navbar() {
    return (
        <nav>
            <h2>Career Companion</h2>

            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/goals"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                Goals
            </NavLink>

            <NavLink
                to="/skills"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                Skills
            </NavLink>

            <NavLink
                to="/resources"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                Resources
            </NavLink>

            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                Dashboard
            </NavLink>
        </nav>
    );
}

export default Navbar;