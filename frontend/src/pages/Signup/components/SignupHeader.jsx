import { useNavigate } from "react-router-dom";

function SignupHeader() {
  const navigate = useNavigate();

  return (
    <header className="signup-header">
      <button className="signup-brand" onClick={() => navigate("/")}>
        Career Companion
      </button>

      <div className="signup-login">
        <span>Already have an account?</span>

        <button onClick={() => navigate("/login")}>Sign in →</button>
      </div>
    </header>
  );
}

export default SignupHeader;
