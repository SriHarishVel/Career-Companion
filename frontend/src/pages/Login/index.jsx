import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            (user) => user.email === formData.email
        );

        if (!user) {
            setErrors({
                email: "Email not found"
            });

            return;
        }

        if (user.password !== formData.password) {
            setErrors({
                password: "Incorrect password"
            });

            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        alert("Login Successful!");

        navigate("/dashboard");
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h1>Career Companion</h1>
                <h2>Welcome Back</h2>

                <form onSubmit={handleSubmit}>

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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
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

                    <div className="login-options">
                        <label>
                            <input type="checkbox" />
                            Remember Me
                        </label>

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                    >
                        Login
                    </button>

                    <p className="signup-link">
                        Don't have an account?{" "}
                        <Link to="/signup">
                            Sign Up
                        </Link>
                    </p>

                </form>

            </div>
        </div>
    );
}

export default Login;