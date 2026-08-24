import { useState } from "react";
import "./index.css";

function SearchFilterBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClearFilters,
  children,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const useFilterPopup = filters.length >= 0;

  const hasActiveFilters = filters.some(
    (filter) =>
      filter.value !== undefined &&
      filter.defaultValue !== undefined &&
      filter.value !== filter.defaultValue,
  );

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearchChange(localSearch);
  }

  function handleClearFilters() {
    setLocalSearch("");

    if (onClearFilters) {
      onClearFilters();
    } else {
      onSearchChange("");
    }
  }

  return (
    <>
      <form className="search-sort-bar" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <input
            id="goal-search"
            name="search"
            type="search"
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            aria-label="Search"
          />

          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </div>

        <select
          id="goal-sort"
          name="sort"
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort"
        >
          {children}
        </select>

        {useFilterPopup && (
          <button
            type="button"
            className={`search-sort-filter-btn ${
              hasActiveFilters ? "has-active-filters" : ""
            }`}
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="filter-icon" aria-hidden="true">
              ☷
            </span>

            <span>Filters</span>

            {hasActiveFilters && <span className="filter-active-dot" />}
          </button>
        )}
      </form>

      {useFilterPopup && isFilterOpen && (
        <div
          className="filter-panel-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsFilterOpen(false);
            }
          }}
        >
          <div
            className="filter-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-panel-title"
          >
            <div className="filter-panel-header">
              <h2 id="filter-panel-title">Filters</h2>

              <button
                type="button"
                className="filter-panel-close"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className="filter-panel-content">
              {filters.map((filter) => {
                const filterId = `search-filter-${filter.label
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div className="filter-group" key={filter.label}>
                    <label htmlFor={filterId}>{filter.label}</label>

                    <select
                      id={filterId}
                      value={filter.value}
                      onChange={(event) => filter.onChange(event.target.value)}
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="filter-panel-actions">
              {onClearFilters && (
                <button
                  type="button"
                  className="filter-panel-clear"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                className="filter-panel-apply"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchFilterBar;