function Dashboard() {
    const totalGoals = 3;
    const totalSkills = 3;
    const totalResources = 2;

    return (
        <>
            <h1>Career Dashboard</h1>

            <hr />

            <div>
                <h2>Total Goals</h2>
                <p>{totalGoals}</p>
            </div>

            <hr />

            <div>
                <h2>Total Skills</h2>
                <p>{totalSkills}</p>
            </div>

            <hr />

            <div>
                <h2>Total Resources</h2>
                <p>{totalResources}</p>
            </div>
        </>
    );
}

export default Dashboard;