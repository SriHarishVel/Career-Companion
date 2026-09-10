import SearchFilterBar from "../../../components/SearchFilterBar";

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
  onClearFilters,
  onApplyFilters,
}) {
  const filters = [
    {
      label: "Status",
      value: statusFilter,
      defaultValue: "All",
      onChange: setStatusFilter,
      options: [
        { value: "All", label: "All Statuses" },
        { value: "Applied", label: "Applied" },
        { value: "In Progress", label: "In Progress" },
        { value: "Offer", label: "Offer" },
        { value: "Rejected", label: "Rejected" },
        { value: "Withdrawn", label: "Withdrawn" },
      ],
    },
    {
      label: "Career Goal",
      value: goalFilter,
      defaultValue: "All",
      onChange: setGoalFilter,
      options: [
        { value: "All", label: "All Goals" },
        ...primaryGoalOptions.map((goal) => ({
          value: goal._id,
          label: goal.title,
        })),
      ],
    },
  ];

  return (
    <div className="filters-card">
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        sortValue={sortBy}
        onSortChange={setSortBy}
        searchPlaceholder="Search applications..."
        filters={filters}
        onClearFilters={onClearFilters}
        onApplyFilters={onApplyFilters}
      >
        <option value="Last Updated">Last Updated</option>
        <option value="Applied Date">Applied Date</option>
        <option value="Company">Company</option>
        <option value="Role">Role</option>
      </SearchFilterBar>
    </div>
  );
}

export default ApplicationFilters;
