import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../../services/authService";

import "../Auth/index.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(token, formData.newPassword);

      setMessage(response.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-mode">
      <header className="auth-header">
        <button className="auth-brand" onClick={() => navigate("/")}>
          Career Companion
        </button>

        <div className="auth-header-action">
          <span>Remember your password?</span>

          <button onClick={() => navigate("/login")}>Sign in →</button>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-visual">
          <div className="auth-visual-content visual-login">
            <span className="auth-label">CAREER COMPANION</span>

            <div className="auth-visual-copy">
              <div className="auth-copy login-copy">
                <h1>
                  Almost
                  <br />
                  <span>there.</span>
                </h1>

                <p>
                  Create a new password and continue building toward your next
                  opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-heading">
              <span>RESET YOUR PASSWORD</span>

              <h2>
                Create a new
                <br />
                password.
              </h2>

              <p>Choose a new password for your Career Companion account.</p>
            </div>

            {!message ? (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                  <label htmlFor="reset-new-password">New password</label>

                  <div className="auth-password-field">
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />

                    <button
                      type="button"
                      className="auth-toggle-password"
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="reset-confirm-password">
                    Confirm password
                  </label>

                  <div className="auth-password-field">
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />

                    <button
                      type="button"
                      className="auth-toggle-password"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update password →"}
                </button>
              </form>
            ) : (
              <>
                <div className="auth-success">{message}</div>

                <button
                  type="button"
                  className="auth-submit"
                  onClick={() => navigate("/login")}
                >
                  Back to login →
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResetPassword;