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
}) {
  return (
    <div className="application-form-fields">
      <div className="filter-group">
        <label>Company</label>

        <input
          type="text"
          placeholder="e.g. Google"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Role</label>

        <input
          type="text"
          placeholder="e.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Application URL</label>

        <input
          type="url"
          placeholder="https://..."
          value={applicationUrl}
          onChange={(e) => setApplicationUrl(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Status</label>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="In Progress">In Progress</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          Career Goal
          <span className="optional-label">Optional</span>
        </label>

        <select
          value={primaryGoalId}
          onChange={(e) => setPrimaryGoalId(e.target.value)}
        >
          <option value="">No Career Goal</option>

          {primaryGoalOptions.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Applied Date</label>

        <input
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ApplicationForm;
