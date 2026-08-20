import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authService";
import LoginForm from "./components/LoginForm";

import "./index.css";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      setError("");

      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <button className="login-brand" onClick={() => navigate("/")}>
          Career Companion
        </button>

        <div className="login-signup">
          <span>New to Career Companion?</span>

          <button onClick={() => navigate("/signup")}>Create account →</button>
        </div>
      </header>

      <main className="login-main">
        {/* Career visual */}
        <section className="login-visual">
          <div className="login-visual-content">
            <h1>
              Welcome
              <br />
              <span>back.</span>
            </h1>

            <p>
              Pick up where you left off and keep building toward your next
              opportunity.
            </p>

            <div className="login-line">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="login-panel">
          <div className="login-panel-inner">
            <div className="login-heading">
              <span>WELCOME BACK</span>

              <h2>
                Continue your
                <br />
                journey.
              </h2>

              <p>Sign in to pick up where you left off.</p>
            </div>

            <LoginForm onSubmit={handleSubmit} error={error} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
