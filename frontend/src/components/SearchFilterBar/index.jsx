import { useRef, useState } from "react";

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
  const searchTimer = useRef(null);

  const useFilterPopup = filters.length >= 4;

  const hasActiveFilters = filters.some(
    (filter) =>
      filter.value !== undefined &&
      filter.defaultValue !== undefined &&
      filter.value !== filter.defaultValue,
  );

  function handleSearchChange(event) {
    const value = event.target.value;

    setLocalSearch(value);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  }

  function handleClearFilters() {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    setLocalSearch("");

    if (onClearFilters) {
      onClearFilters();
    }
  }

  function closeFilterPanel() {
    setIsFilterOpen(false);
  }

  return (
    <>
      <div className="search-sort-bar">
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={localSearch}
          onChange={handleSearchChange}
          aria-label="Search"
        />

        <select
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
      </div>

      {useFilterPopup && isFilterOpen && (
        <div
          className="filter-panel-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFilterPanel();
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
              <div>
                <span className="filter-panel-label">Refine</span>

                <h2 id="filter-panel-title">Filters</h2>
              </div>

              <button
                type="button"
                className="filter-panel-close"
                onClick={closeFilterPanel}
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
                onClick={closeFilterPanel}
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
