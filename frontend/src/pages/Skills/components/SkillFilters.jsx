import SearchSortBar from "../../../components/SearchFilterBar";

function SkillFilters({
  searchSkill,
  setSearchSkill,
  sortOption,
  setSortOption,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  skillCount,
}) {
  return (
    <div className="filters-card">
      <div className="filters-header">
        <div>
          <h3>Find a Skill</h3>

          <p>Search, sort, and filter your skills.</p>
        </div>

        <span className="skill-counter">
          {skillCount} {skillCount === 1 ? "skill" : "skills"}
        </span>
      </div>

      <SearchSortBar
        searchValue={searchSkill}
        onSearchChange={setSearchSkill}
        sortValue={sortOption}
        onSortChange={setSortOption}
        searchPlaceholder="Search skills..."
      >
        <option value="default">Default</option>

        <option value="az">A-Z</option>

        <option value="za">Z-A</option>

        <option value="progressHigh">Highest Progress</option>

        <option value="progressLow">Lowest Progress</option>

        <option value="recent">Recently Updated</option>
      </SearchSortBar>

      <div className="skill-filter-options">
        <div className="filter-group">
          <label>Category</label>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>

            <option value="Programming">Programming</option>

            <option value="Database">Database</option>

            <option value="Framework">Framework</option>

            <option value="Tools">Tools</option>

            <option value="Soft Skills">Soft Skills</option>

            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Level</label>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="All">All Levels</option>

            <option value="Beginner">Beginner</option>

            <option value="Intermediate">Intermediate</option>

            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SkillFilters;
