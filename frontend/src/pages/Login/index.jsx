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

            alert("Login Successful!");

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };

    return (
        <LoginForm
            onSubmit={handleSubmit}
            error={error}
        />
    );
}

export default Login;