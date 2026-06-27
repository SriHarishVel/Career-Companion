import "./index.css";

function Home() {

    return (
        <div className="container">

            <h1>Home</h1>

            <div className="home-grid">

                <div className="home-card">
                    <h2>Career Journey</h2>

                    <p>
                        Continue your career journey.
                    </p>

                    <button>
                        Continue Journey
                    </button>
                </div>

                <div className="home-card">

                    <h2>Journey Progress</h2>

                    <div className="journey-progress">

                        <div className="journey-step completed">
                            Primary Goal
                        </div>

                        <div className="journey-step">
                            Secondary Goals
                        </div>

                        <div className="journey-step">
                            Skills
                        </div>

                        <div className="journey-step">
                            Resources
                        </div>

                        <div className="journey-step">
                            Applications
                        </div>

                    </div>

                </div>

                <div className="home-card">
                    <h2>Current Goal</h2>

                    <p>
                        No primary goal selected.
                    </p>
                </div>

                <div className="home-card">
                    <h2>Today's Focus</h2>

                    <p>
                        Nothing planned yet.
                    </p>
                </div>

                <div className="home-card">
                    <h2>Quick Access</h2>

                    <div className="quick-links">

                        <button>Goals</button>

                        <button>Skills</button>

                        <button>Resources</button>

                        <button>Applications</button>

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Home;