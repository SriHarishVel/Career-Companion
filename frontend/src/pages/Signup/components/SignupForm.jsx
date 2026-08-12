import { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm({ onSubmit, error }) {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {

        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Invalid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password";
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(e, formData);
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Full Name</label>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                />

                {errors.fullName && (
                    <p className="error-message">
                        {errors.fullName}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label>Email</label>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                />

                {errors.email && (
                    <p className="error-message">
                        {errors.email}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label>Password</label>

                <div className="password-field">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>

                </div>

                {errors.password && (
                    <p className="error-message">
                        {errors.password}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label>Confirm Password</label>

                <div className="password-field">

                    <input
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() =>
                            setShowConfirmPassword(
                                !showConfirmPassword
                            )
                        }
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                </div>

                {errors.confirmPassword && (
                    <p className="error-message">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="signup-btn"
            >
                Create Account
            </button>

            <p className="login-link">
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </form>
    );
}

export default SignupForm;