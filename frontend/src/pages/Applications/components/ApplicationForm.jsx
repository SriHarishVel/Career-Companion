function ApplicationForm({
    company,
    setCompany,
    role,
    setRole,
    applicationUrl,
    setApplicationUrl,
    status,
    setStatus,
    primaryGoalId,
    setPrimaryGoalId,
    appliedDate,
    setAppliedDate,
    primaryGoalOptions,
    addApplication,
}) {
    return (
        <div className="add-application-card">
            <h3>Add Application</h3>

            <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />

            <input
                type="url"
                placeholder="Application URL"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Applied">Applied</option>
                <option value="In Progress">In Progress</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
            </select>

            <select
                value={primaryGoalId}
                onChange={(e) => setPrimaryGoalId(e.target.value)}
            >
                <option value="">
                    Career Goal (Optional)
                </option>

                {primaryGoalOptions.map(goal => (
                    <option
                        key={goal._id}
                        value={goal._id}
                    >
                        {goal.title}
                    </option>
                ))}
            </select>

            <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
            />

            <button onClick={addApplication}>
                Add Application
            </button>
        </div>
    );
}

export default ApplicationForm;