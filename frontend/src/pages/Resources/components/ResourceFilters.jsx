import SearchSortBar from "../../../components/SearchFilterBar";

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
    <section className="resource-filters-card">
      <div className="resource-filters-header">
        <div>
          <span className="resource-section-label">Resources</span>

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
          <label htmlFor="resource-type-filter">Resource Type</label>

          <select
            id="resource-type-filter"
            value={filterOption}
            onChange={(event) => setFilterOption(event.target.value)}
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
          <label htmlFor="resource-skill-filter">Related Skill</label>

          <select
            id="resource-skill-filter"
            value={skillFilter}
            onChange={(event) => setSkillFilter(event.target.value)}
          >
            <option value="All">All Skills</option>

            {skills.map((skill) => {
              const parentGoal = getParentGoalTitle(skill);

              return (
                <option key={skill._id} value={skill._id}>
                  {parentGoal ? `${parentGoal} → ${skill.name}` : skill.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </section>
  );
}

export default ResourceFilters;
