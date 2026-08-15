import { useNavigate } from "react-router-dom";
import "./index.css";

import notFoundIllustration from "../../assets/404-illustration.png";

function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="not-found-page">

            <div className="not-found-content">

                <img
                    src={notFoundIllustration}
                    alt="Career journey with a 404 path"
                    className="not-found-illustration"
                />

                <div className="not-found-text">

                    <span className="not-found-code">
                        404
                    </span>

                    <h1>
                        Page not found
                    </h1>

                    <p>
                        Looks like this path doesn't lead anywhere.
                    </p>

                    <button
                        className="not-found-home"
                        onClick={() => navigate("/")}
                    >
                        <span className="not-found-home-icon">
                            ↩
                        </span>

                        <span className="not-found-home-text">
                            Find my way back
                        </span>
                    </button>

                </div>

            </div>

        </main>
    );
}

export default NotFound;