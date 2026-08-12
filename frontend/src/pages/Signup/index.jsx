import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import SignupForm from "./components/SignupForm";
import "./index.css";

function Signup() {

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const handleSubmit = async (e, formData) => {

        try {

            setError("");

            await register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            alert("Account created successfully!");

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    };

    return (
        <div className="signup-container">

            <div className="signup-card">

                <h1>Career Companion</h1>
                <h2>Create Account</h2>

                <SignupForm
                    onSubmit={handleSubmit}
                    error={error}
                />

            </div>

        </div>
    );
}

export default Signup;