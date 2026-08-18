import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    FaHome,
    FaBullseye,
    FaLaptopCode,
    FaBook,
    FaChartLine,
    FaBriefcase,
    FaBars,
    FaTimes,
    FaUser,
} from "react-icons/fa";

import "./index.css";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");

    function closeMenu() {
        setMenuOpen(false);
    }

    // Hide navbar when user is not authenticated
    if (!token) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="navbar-header">

                <div className="logo">
                    Career Companion
                </div>

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

            </div>


            <div
                className={`navbar-menu ${
                    menuOpen ? "open" : ""
                }`}
            >

                <div className="nav-links">

                    <NavLink
                        to="/"
                        end
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaHome />
                        <span>Home</span>
                    </NavLink>

                    <NavLink
                        to="/goals"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaBullseye />
                        <span>Goals</span>
                    </NavLink>

                    <NavLink
                        to="/skills"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaLaptopCode />
                        <span>Skills</span>
                    </NavLink>

                    <NavLink
                        to="/resources"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaBook />
                        <span>Resources</span>
                    </NavLink>
                    
                    <NavLink
                        to="/applications"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaBriefcase />
                        <span>Applications</span>
                    </NavLink>
                    
                    <NavLink
                        to="/dashboard"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaChartLine />
                        <span>Dashboard</span>
                    </NavLink>
                    
                    <NavLink
                        to="/profile"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <FaUser />
                        <span>Profile</span>
                    </NavLink>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;