import SearchFilterBar from "../../../components/SearchFilterBar";

function ResourceFilters({
  searchResource,
  setSearchResource,
  sortOption,
  setSortOption,
  filterOption,
  setFilterOption,
  skillFilter,
  setSkillFilter,
  skills,
  getParentGoalTitle,
  onClearFilters,
  onApplyFilters,
}) {
  const filters = [
    {
      label: "Resource Type",
      value: filterOption,
      defaultValue: "All",
      onChange: setFilterOption,
      options: [
        { value: "All", label: "All Resources" },
        { value: "Favorites", label: "Favorites" },
        { value: "Documentation", label: "Documentation" },
        { value: "Course", label: "Course" },
        { value: "Video", label: "Video" },
        { value: "Article", label: "Article" },
        { value: "Book", label: "Book" },
        { value: "Practice", label: "Practice" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      label: "Related Skill",
      value: skillFilter,
      defaultValue: "All",
      onChange: setSkillFilter,
      options: [
        { value: "All", label: "All Skills" },
        ...skills.map((skill) => {
          const parentGoal = getParentGoalTitle(skill);

          return {
            value: skill._id,
            label: parentGoal ? `${parentGoal} → ${skill.name}` : skill.name,
          };
        }),
      ],
    },
  ];

  return (
    <div className="resource-filters">
      <SearchFilterBar
        searchValue={searchResource}
        onSearchChange={setSearchResource}
        sortValue={sortOption}
        onSortChange={setSortOption}
        searchPlaceholder="Search resources..."
        filters={filters}
        onClearFilters={onClearFilters}
        onApplyFilters={onApplyFilters}
      >
        <option value="default">Default</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="updatedAt">Recently Updated</option>
      </SearchFilterBar>
    </div>
  );
}

export default ResourceFilters;
