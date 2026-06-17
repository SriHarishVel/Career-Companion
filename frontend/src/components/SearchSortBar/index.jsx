function SearchSortBar({
    searchValue,
    onSearchChange,
    sortValue,
    onSortChange,
    searchPlaceholder,
    children
}) {
    return (
        <>
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