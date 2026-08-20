import { useState } from "react";

function LoginForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <form className="auth-form" onSubmit={(e) => onSubmit(e, formData)}>
      {/* Email */}
      <div className="auth-form-group">
        <label htmlFor="login-email">Email</label>

        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      {/* Password */}
      <div className="auth-form-group">
        <div className="auth-password-label">
          <label htmlFor="login-password">Password</label>

          <button type="button" className="auth-forgot-password">
            Forgot password?
          </button>
        </div>

        <div className="auth-password-field">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
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

      {/* Server error */}
      {error && <div className="auth-error">{error}</div>}

      {/* Submit */}
      <button type="submit" className="auth-submit">
        Continue to dashboard →
      </button>
    </form>
  );
}

export default LoginForm;
