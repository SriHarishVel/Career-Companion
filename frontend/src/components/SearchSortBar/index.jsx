function SearchSortBar({
    searchValue,
    onSearchChange,
    sortValue,
    onSortChange,
    searchPlaceholder,
    children
}) {
    // Reusable search input plus sort dropdown used by list pages.
    return (
        <>
            {/* Search box */}
            <input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) =>
                    onSearchChange(
                        e.target.value
                    )
                }
            />

            {/* Sort dropdown */}
            <select
                value={sortValue}
                onChange={(e) =>
                    onSortChange(
                        e.target.value
                    )
                }
            >
                {children}
            </select>
        </>
    );
}

export default SearchSortBar;
