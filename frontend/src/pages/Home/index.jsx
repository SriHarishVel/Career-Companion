function Home() {
    const totalGoals = 3;
    const totalSkills = 3;
    const totalResources = 2;

    return (
        <div className="container">
            {/* App name */}
            <h1>Career Companion</h1>

            {/* Welcome message */}
            <p className="welcome">
                Welcome back, Harish!
            </p>

            <hr />

            {/* Quick summary numbers */}
            <h2>Quick Overview</h2>

            <ul className="overview">
                <li>Goals Tracking: {totalGoals}</li>
                <li>Skills Management: {totalSkills}</li>
                <li>Learning Resources: {totalResources}</li>
            </ul>
        </div>
    );
}

export default Home
