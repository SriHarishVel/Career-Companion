import { useState } from "react";

function SignupForm({ onSubmit, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(e, formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Full name */}
      <div className="auth-form-group">
        <label htmlFor="signup-fullName">Full Name</label>

        <input
          id="signup-fullName"
          type="text"
          name="fullName"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={handleChange}
          autoComplete="name"
        />

        {errors.fullName && (
          <p className="auth-error-message">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="auth-form-group">
        <label htmlFor="signup-email">Email</label>

        <input
          id="signup-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        {errors.email && <p className="auth-error-message">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="auth-form-group">
        <label htmlFor="signup-password">Password</label>

        <div className="auth-password-field">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button
            type="button"
            className="auth-toggle-password"
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p className="auth-error-message">{errors.password}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="auth-form-group">
        <label htmlFor="signup-confirmPassword">Confirm Password</label>

        <div className="auth-password-field">
          <input
            id="signup-confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <button
            type="button"
            className="auth-toggle-password"
            onClick={() => setShowConfirmPassword((previous) => !previous)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="auth-error-message">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Server error */}
      {error && <div className="auth-error">{error}</div>}

      {/* Submit */}
      <button type="submit" className="auth-submit">
        Create my account →
      </button>
    </form>
  );
}

export default SignupForm;
