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
  errorMsg,
  onSubmit,
}) {
  return (
    <form
      id="application-form"
      className="application-form-fields"
      onSubmit={onSubmit}
    >
      <div className="filter-group">
        <label htmlFor="application-company">Company</label>

        <input
          id="application-company"
          type="text"
          placeholder="e.g. Google"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>

      <div className="filter-group">
        <label htmlFor="application-role">Role</label>

        <input
          id="application-role"
          type="text"
          placeholder="e.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>

      <div className="filter-group">
        <label htmlFor="application-url">Application URL</label>

        <input
          id="application-url"
          type="url"
          placeholder="https://..."
          value={applicationUrl}
          onChange={(e) => setApplicationUrl(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="application-status">Status</label>

        <select
          id="application-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="In Progress">In Progress</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="application-goal">
          Career Goal
          <span className="optional-label">Optional</span>
        </label>

        <select
          id="application-goal"
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
        <label htmlFor="application-date">Applied Date</label>

        <input
          id="application-date"
          type="date"
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
        />
      </div>

      {errorMsg && (
        <p className="error" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}

export default ApplicationForm;
