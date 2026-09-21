import { useEffect, useState } from "react";

function LoginForm({ onSubmit, onGoogleLogin, onForgotPassword, error }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    function renderGoogleButton() {
      if (!window.google) {
        return;
      }

      const googleButton = document.getElementById("google-sign-in-button");

      if (!googleButton) {
        return;
      }

      googleButton.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          onGoogleLogin(response.credential);
        },
      });

      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
        shape: "rectangular",
      });
    }

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton);

      return () => {
        existingScript.removeEventListener("load", renderGoogleButton);
      };
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [onGoogleLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div>
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

            <button
              type="button"
              className="auth-forgot-password"
              onClick={onForgotPassword}
            >
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

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <div id="google-sign-in-button" className="google-sign-in-button" />
    </div>
  );
}

export default LoginForm;