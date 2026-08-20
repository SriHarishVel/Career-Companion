import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/authService";

import SignupHeader from "./components/SignupHeader";
import SignupHero from "./components/SignupHero";
import SignupForm from "./components/SignupForm";

import "./index.css";

function Signup() {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e, formData) => {
    try {
      setError("");

      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-page">
      <SignupHeader />

      <main className="signup-main">
        <SignupHero />

        <section className="signup-panel">
          <div className="signup-panel-inner">
            <div className="signup-heading">
              <span>Create your account</span>

              <h2>
                Build your
                <br />
                career companion.
              </h2>

              <p>Start organizing your career journey in one place.</p>
            </div>

            <SignupForm onSubmit={handleSubmit} error={error} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Signup;
