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
      className="application-form"
      onSubmit={onSubmit}
    >
      <div className="application-form-field">
        <label htmlFor="application-company">Company</label>

        <input
          id="application-company"
          type="text"
          placeholder="e.g. Google"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />
      </div>

      <div className="application-form-field">
        <label htmlFor="application-role">Role</label>

        <input
          id="application-role"
          type="text"
          placeholder="e.g. Software Engineer"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          required
        />
      </div>

      <div className="application-form-field">
        <label htmlFor="application-url">Application URL</label>

        <input
          id="application-url"
          type="url"
          placeholder="https://..."
          value={applicationUrl}
          onChange={(event) => setApplicationUrl(event.target.value)}
        />
      </div>

      <div className="application-form-grid">
        <div className="application-form-field">
          <label htmlFor="application-status">Status</label>

          <select
            id="application-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="application-form-field">
          <label htmlFor="application-date">Applied Date</label>

          <input
            id="application-date"
            type="date"
            value={appliedDate}
            onChange={(event) => setAppliedDate(event.target.value)}
          />
        </div>
      </div>

      <div className="application-form-field">
        <label htmlFor="application-goal">
          Career Goal
          <span className="application-form-optional">Optional</span>
        </label>

        <select
          id="application-goal"
          value={primaryGoalId}
          onChange={(event) => setPrimaryGoalId(event.target.value)}
        >
          <option value="">No Career Goal</option>

          {primaryGoalOptions.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      {errorMsg && (
        <p className="application-form-error" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}

export default ApplicationForm;
