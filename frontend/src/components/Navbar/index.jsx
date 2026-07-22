import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaBullseye,
    FaLaptopCode,
    FaBook,
    FaChartLine,
    FaBriefcase,
    FaSignOutAlt
} from "react-icons/fa";
import "./index.css";

function Navbar() {
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/login");
    }

    // Hide navbar on login/signup pages
    if (!currentUser) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="logo">
                Career Companion
            </div>

            <div className="nav-links">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaHome />
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/goals"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaBullseye />
                    <span>Goals</span>
                </NavLink>

                <NavLink
                    to="/skills"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaLaptopCode />
                    <span>Skills</span>
                </NavLink>

                <NavLink
                    to="/resources"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaBook />
                    <span>Resources</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaChartLine />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaBriefcase />
                    <span>Applications</span>
                </NavLink>

            </div>

            <div className="user-section">

                <span className="welcome">
                    Hi, {currentUser.fullName.split(" ")[0]} 👋
                </span>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;