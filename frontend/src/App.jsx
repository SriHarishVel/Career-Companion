import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Skills from "./pages/Skills";
import Resources from "./pages/Resources";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Applications from "./pages/Applications";

function App() {
  return (
    <>
      {/* Navigation shown on every page */}
      <Navbar />

      {/* Page routes */}
      <Routes>
        <Route
            path="/login"
            element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            }
        />

        <Route
            path="/signup"
            element={
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            }
        />

        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }
        />

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/goals"
            element={
                <ProtectedRoute>
                    <Goals />
                </ProtectedRoute>
            }
        />

        <Route
            path="/skills"
            element={
                <ProtectedRoute>
                    <Skills />
                </ProtectedRoute>
            }
        />

        <Route
            path="/resources"
            element={
                <ProtectedRoute>
                    <Resources />
                </ProtectedRoute>
            }
        />

        <Route
            path="/applications"
            element={
                <ProtectedRoute>
                    <Applications />
                </ProtectedRoute>
            }
        />
      </Routes>

      {/* Footer shown on every page */}
      <Footer />
    </>
  );
}

export default App;
