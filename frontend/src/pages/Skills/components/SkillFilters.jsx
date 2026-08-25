import SearchFilterBar from "../../../components/SearchFilterBar";

function SkillFilters({
  searchSkill,
  setSearchSkill,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
}) {
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
          value: "Programming",
          label: "Programming",
        },
        {
          value: "Design",
          label: "Design",
        },
        {
          value: "Communication",
          label: "Communication",
        },
        {
          value: "Business",
          label: "Business",
        },
        {
          value: "Other",
          label: "Other",
        },
      ],
    },

    {
      label: "Level",
      value: levelFilter,
      defaultValue: "All",
      onChange: setLevelFilter,
      options: [
        {
          value: "All",
          label: "All Levels",
        },
        {
          value: "Beginner",
          label: "Beginner",
        },
        {
          value: "Intermediate",
          label: "Intermediate",
        },
        {
          value: "Advanced",
          label: "Advanced",
        },
      ],
    },
  ];

  function clearFilters() {
    setSearchSkill("");
    setSortOption("default");
    setCategoryFilter("All");
    setLevelFilter("All");
  }

  return (
    <div className="skill-filters">
      <SearchFilterBar
        searchValue={searchSkill}
        onSearchChange={setSearchSkill}
        sortValue={sortOption}
        onSortChange={setSortOption}
        searchPlaceholder="Search skills..."
        filters={filters}
        onClearFilters={clearFilters}
      >
        <option value="default">Default</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="progressHigh">Highest Progress</option>
        <option value="progressLow">Lowest Progress</option>
        <option value="recent">Recently Updated</option>
      </SearchFilterBar>
    </div>
  );
}

export default SkillFilters;
