import SearchFilterBar from "../../../components/SearchFilterBar";

function GoalFilters({
  searchGoal,
  setSearchGoal,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  goalTypeFilter,
  setGoalTypeFilter,
  statusFilter,
  setStatusFilter,
}) {
  function clearFilters() {
    setSearchGoal("");
    setSortOption("default");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setGoalTypeFilter("All");
    setStatusFilter("All");
  }

  const filters = [
    {
      label: "Category",
      value: categoryFilter,
      defaultValue: "All",
      onChange: setCategoryFilter,
      options: [
        {
          value: "All",
          label: "All Categories",
        },
        {
          value: "Learning",
          label: "Learning",
        },
        {
          value: "Career",
          label: "Career",
        },
        {
          value: "Personal",
          label: "Personal",
        },
        {
          value: "Health",
          label: "Health",
        },
      ],
    },
    {
      label: "Priority",
      value: priorityFilter,
      defaultValue: "All",
      onChange: setPriorityFilter,
      options: [
        {
          value: "All",
          label: "All Priorities",
        },
        {
          value: "High",
          label: "High",
        },
        {
          value: "Medium",
          label: "Medium",
        },
        {
          value: "Low",
          label: "Low",
        },
      ],
    },
    {
      label: "Goal Type",
      value: goalTypeFilter,
      defaultValue: "All",
      onChange: setGoalTypeFilter,
      options: [
        {
          value: "All",
          label: "All Types",
        },
        {
          value: "Primary",
          label: "Primary Goals",
        },
        {
          value: "Secondary",
          label: "Secondary Goals",
        },
      ],
    },
    {
      label: "Status",
      value: statusFilter,
      defaultValue: "All",
      onChange: setStatusFilter,
      options: [
        {
          value: "All",
          label: "All Goals",
        },
        {
          value: "Active",
          label: "Active Goals",
        },
        {
          value: "Completed",
          label: "Completed Goals",
        },
      ],
    },
  ];

  return (
    <div className="goal-filters">
      <SearchFilterBar
        searchValue={searchGoal}
        onSearchChange={setSearchGoal}
        sortValue={sortOption}
        onSortChange={setSortOption}
        searchPlaceholder="Search goals..."
        filters={filters}
        onClearFilters={clearFilters}
      >
        <option value="default">Default</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="priorityHigh">Priority High-Low</option>
        <option value="priorityLow">Priority Low-High</option>
        <option value="high">Highest Progress</option>
        <option value="low">Lowest Progress</option>
        <option value="recent">Recently Updated</option>
      </SearchFilterBar>
    </div>
  );
}

export default GoalFilters;
