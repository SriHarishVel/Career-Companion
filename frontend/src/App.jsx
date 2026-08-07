import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Skills from "./pages/Skills";
import Resources from "./pages/Resources";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            {/* Navigation shown on every page */}
            <Navbar />

            {/* Page routes */}
            <Routes>

                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

            </Routes>

            {/* Footer shown on every page */}
            <Footer />
        </>
    );
}

export default App;