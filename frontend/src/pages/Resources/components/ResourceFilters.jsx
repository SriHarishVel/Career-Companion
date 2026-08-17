import SearchSortBar from "../../../components/SearchSortBar";

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
  return (
    <div className="resource-filters-card">
      <div className="resource-filters-header">
        <div>
          <h3>Find a Resource</h3>

          <p>Search, sort, and filter your learning resources.</p>
        </div>
      </div>

      <SearchSortBar
        searchValue={searchResource}
        onSearchChange={setSearchResource}
        sortValue={sortOption}
        onSortChange={setSortOption}
        searchPlaceholder="Search resources..."
      >
        <option value="default">Default</option>

        <option value="az">A-Z</option>

        <option value="za">Z-A</option>

        <option value="recent">Recently Updated</option>
      </SearchSortBar>

      <div className="resource-filter-options">
        <div className="filter-group">
          <label>Resource Type</label>

          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="All">All Resources</option>

            <option value="Favorites">Favorites</option>

            <option value="Documentation">Documentation</option>

            <option value="Course">Course</option>

            <option value="Video">Video</option>

            <option value="Article">Article</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Related Skill</label>

          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="All">All Skills</option>

            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {`${getParentGoalTitle(skill)} → ${skill.name}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ResourceFilters;
