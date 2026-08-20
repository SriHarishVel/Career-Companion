import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login, register } from "../../services/authService";

import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

import "./index.css";

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const isSignup = location.pathname === "/signup";

  // Handle login
  const handleLogin = async (e, formData) => {
    e.preventDefault();

    try {
      setLoginError("");

      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    }
  };

  // Handle signup
  const handleSignup = async (e, formData) => {
    e.preventDefault();

    try {
      setSignupError("");

      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setSignupError(error.response?.data?.message || "Registration failed");
    }
  };

  // Switch mode
  const switchMode = () => {
    navigate(isSignup ? "/login" : "/signup");
  };

  return (
    <div className={`auth-page ${isSignup ? "signup-mode" : "login-mode"}`}>
      <header className="auth-header">
        <button className="auth-brand" onClick={() => navigate("/")}>
          Career Companion
        </button>

        <div className="auth-header-action">
          <span>
            {isSignup ? "Already have an account?" : "New to Career Companion?"}
          </span>

          <button onClick={switchMode}>
            {isSignup ? "Sign in →" : "Create account →"}
          </button>
        </div>
      </header>

      <main className="auth-main">
        {/* Visual */}
        <section className="auth-visual">
          <div
            className={`auth-visual-content ${
              isSignup ? "visual-signup" : "visual-login"
            }`}
          >
            <span className="auth-label">CAREER COMPANION</span>

            <div className="auth-visual-copy">
              <div className="auth-copy login-copy">
                <h1>
                  Welcome
                  <br />
                  <span>back.</span>
                </h1>

                <p>
                  Pick up where you left off and keep building toward your next
                  opportunity.
                </p>
              </div>

              <div className="auth-copy signup-copy">
                <h1>
                  Build the
                  <br />
                  career
                  <br />
                  <span>you want.</span>
                </h1>

                <p>
                  Set your direction, build the right skills, and turn your next
                  move into progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-form-slider">
              {/* Login */}
              <div className="auth-form-view login-view">
                <div className="auth-heading">
                  <span>WELCOME BACK</span>

                  <h2>
                    Continue your
                    <br />
                    journey.
                  </h2>

                  <p>Sign in to pick up where you left off.</p>
                </div>

                <LoginForm onSubmit={handleLogin} error={loginError} />
              </div>

              {/* Signup */}
              <div className="auth-form-view signup-view">
                <div className="auth-heading">
                  <span>CREATE YOUR ACCOUNT</span>

                  <h2>
                    Start your
                    <br />
                    journey.
                  </h2>

                  <p>
                    Everything you need to organize your career in one place.
                  </p>
                </div>

                <SignupForm onSubmit={handleSignup} error={signupError} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Auth;
