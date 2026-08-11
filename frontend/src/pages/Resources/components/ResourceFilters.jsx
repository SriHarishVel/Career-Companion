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
    getParentGoalTitle
}) {
    return (
        <>
            <SearchSortBar
                searchValue={searchResource}
                onSearchChange={setSearchResource}
                sortValue={sortOption}
                onSortChange={setSortOption}
                searchPlaceholder="Search Resources"
            >
                <option value="default">
                    Default
                </option>

                <option value="az">
                    A-Z
                </option>

                <option value="za">
                    Z-A
                </option>

                <option value="recent">
                    Recently Updated
                </option>
            </SearchSortBar>

            <select
                value={filterOption}
                onChange={(e) =>
                    setFilterOption(e.target.value)
                }
            >
                <option value="All">
                    All Resources
                </option>

                <option value="Favorites">
                    Favorites
                </option>

                <option value="Documentation">
                    Documentation
                </option>

                <option value="Course">
                    Course
                </option>

                <option value="Video">
                    Video
                </option>

                <option value="Article">
                    Article
                </option>
            </select>

            <select
                value={skillFilter}
                onChange={(e) =>
                    setSkillFilter(e.target.value)
                }
            >
                <option value="All">
                    All Skills
                </option>

                {skills.map(skill => (
                    <option
                        key={skill._id}
                        value={skill._id}
                    >
                        {`${getParentGoalTitle(skill)} → ${skill.name}`}
                    </option>
                ))}
            </select>
        </>
    );
}

export default ResourceFilters;