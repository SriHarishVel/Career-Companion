import { useState } from "react";

import { forgotPassword } from "../../../services/authService";

function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(email.trim());

      setMessage(response.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-group">
        <label htmlFor="forgot-password-email">Email</label>

        <input
          id="forgot-password-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading || !!message}
          required
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      {message && <div className="auth-success">{message}</div>}

      {!message && (
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link →"}
        </button>
      )}

      {message && (
        <button type="button" className="auth-submit" onClick={onBackToLogin}>
          Back to login →
        </button>
      )}
    </form>
  );
}

export default ForgotPasswordForm;