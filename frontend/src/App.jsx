import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Skills from "./pages/Skills";
import Resources from "./pages/Resources";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;