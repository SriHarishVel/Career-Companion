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
}) {
  const filters = [
    {
      label: "Resource Type",
      value: filterOption,
      defaultValue: "All",
      onChange: setFilterOption,
      options: [
        {
          value: "All",
          label: "All Resources",
        },
        {
          value: "Favorites",
          label: "Favorites",
        },
        {
          value: "Documentation",
          label: "Documentation",
        },
        {
          value: "Course",
          label: "Course",
        },
        {
          value: "Video",
          label: "Video",
        },
        {
          value: "Article",
          label: "Article",
        },
      ],
    },

    {
      label: "Related Skill",
      value: skillFilter,
      defaultValue: "All",
      onChange: setSkillFilter,
      options: [
        {
          value: "All",
          label: "All Skills",
        },

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

  function handleClearFilters() {
    setFilterOption("All");
    setSkillFilter("All");
  }

  return (
    <SearchFilterBar
      searchValue={searchResource}
      onSearchChange={setSearchResource}
      sortValue={sortOption}
      onSortChange={setSortOption}
      searchPlaceholder="Search resources..."
      filters={filters}
      onClearFilters={handleClearFilters}
      forceFilterPopup
    >
      <option value="default">Default</option>
      <option value="az">A-Z</option>
      <option value="za">Z-A</option>
      <option value="updatedAt">Recently Updated</option>
    </SearchFilterBar>
  );
}

export default ResourceFilters;
