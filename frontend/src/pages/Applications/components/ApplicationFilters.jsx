function ApplicationFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  goalFilter,
  setGoalFilter,
  sortBy,
  setSortBy,
  primaryGoalOptions,
}) {
  return (
    <div className="filters-card">
      <div className="application-filters-grid">
        <div className="filter-group">
          <label>Search</label>

          <input
            type="search"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort By</label>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Last Updated">Last Updated</option>
            <option value="Applied Date">Applied Date</option>
            <option value="Company">Company</option>
            <option value="Role">Role</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="In Progress">In Progress</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Career Goal</label>

          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
          >
            <option value="All">All Goals</option>

            {primaryGoalOptions.map((goal) => (
              <option key={goal._id} value={goal._id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ApplicationFilters;
