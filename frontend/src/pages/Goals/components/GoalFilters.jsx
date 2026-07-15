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
    setStatusFilter
}) {

    return (
        <div className="filters-GoalCard">
            <h3>Filters</h3>

            <div className="filters-toolbar">

                <div className="filter-group">
                    <label>Search</label>

                    <input
                        type="search"
                        placeholder="Search Goals"
                        value={searchGoal}
                        onChange={(e) =>
                            setSearchGoal(
                        e.target.value
                            )
                        }
                    />
                </div>
                
                <div className="filter-group">
                    <label>Sort By</label>

                    <select
                        value={sortOption}
                        onChange={(e) =>
                            setSortOption(
                        e.target.value
                            )
                        }
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

                        <option value="priorityHigh">
                            Priority High-Low
                        </option>

                        <option value="priorityLow">
                            Priority Low-High
                        </option>

                        <option value="high">
                            Highest Progress
                        </option>

                        <option value="low">
                            Lowest Progress
                        </option>

                        <option value="recent">
                            Recently Updated
                        </option>
                            </select>
                        </div>

                <div className="filter-group">
                    <label>Category</label>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                            >
                        <option value="All">
                            All Categories
                        </option>

                        <option value="Learning">
                            Learning
                        </option>

                        <option value="Career">
                            Career
                        </option>

                        <option value="Personal">
                            Personal
                        </option>

                        <option value="Health">
                            Health
                        </option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Priority</label>

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(
                                e.target.value
                            )
                        }
                            >
                        <option value="All">
                            All Priorities
                        </option>

                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>
                    </select>
                </div>
                        
                <div className="filter-group">
                    <label>Goal Type</label>

                    <select
                        value={goalTypeFilter}
                        onChange={(e) =>
                            setGoalTypeFilter(
                                e.target.value
                            )
                        }
                            >
                        <option value="All">
                            All Types
                        </option>

                        <option value="Primary">
                            Primary Goals
                        </option>

                        <option value="Secondary">
                            Secondary Goals
                        </option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status</label>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                            >
                        <option value="All">
                            All Goals
                        </option>

                        <option value="Active">
                            Active Goals
                        </option>

                        <option value="Completed">
                            Completed Goals
                        </option>
                    </select>
                </div>

            </div>

        </div>
    );

}

export default GoalFilters;