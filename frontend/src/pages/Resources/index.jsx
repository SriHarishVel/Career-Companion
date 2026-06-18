import { useState, useEffect } from "react";
import initialResources from "../../data/resources";
import SearchSortBar from "../../components/SearchSortBar";
import "./index.css";

function Resources() {
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newType, setNewType] = useState("Documentation");

    const [errorMsg, setErrorMsg] = useState("");

    const [searchResource, setSearchResource] =
        useState("");

    const [sortOption, setSortOption] =
        useState("default");

    const [editingId, setEditingId] =
        useState(null);

    const [editedTitle, setEditedTitle] =
        useState("");

    const [editedUrl, setEditedUrl] =
        useState("");

    const [resources, setResources] = useState(() => {
        const savedResources =
            localStorage.getItem("resources");

        if (savedResources) {
            return JSON.parse(savedResources);
        }

        return initialResources;
    });

    useEffect(() => {
        localStorage.setItem(
            "resources",
            JSON.stringify(resources)
        );
    }, [resources]);

    function addResource() {
        if (
            newTitle.trim() === "" ||
            newUrl.trim() === ""
        ) {
            setErrorMsg(
                "Title and URL cannot be empty."
            );
            return;
        }

        setErrorMsg("");

        const formattedUrl =
            newUrl.trim();

        setResources(prevResources => [
            ...prevResources,
            {
                id: Date.now(),

                title:
                    newTitle.trim(),

                url:
                    formattedUrl.startsWith(
                        "http"
                    )
                        ? formattedUrl
                        : `https://${formattedUrl}`,

                type: newType,

                favorite: false,

                lastUpdated:
                    Date.now()
            }
        ]);

        setNewTitle("");
        setNewUrl("");
        setNewType("Documentation");
    }

    function deleteResource(resourceId) {
        setResources(prevResources =>
            prevResources.filter(
                resource =>
                    resource.id !==
                    resourceId
            )
        );
    }

    function editResource(
        resourceId,
        updatedTitle,
        updatedUrl
    ) {
        if (
            updatedTitle.trim() === "" ||
            updatedUrl.trim() === ""
        ) {
            return;
        }

        setResources(prevResources =>
            prevResources.map(
                resource => {
                    if (
                        resource.id ===
                        resourceId
                    ) {
                        return {
                            ...resource,

                            title:
                                updatedTitle.trim(),

                            url:
                                updatedUrl.trim(),

                            lastUpdated:
                                Date.now()
                        };
                    }

                    return resource;
                }
            )
        );
    }

    const filteredResources = [
        ...resources
    ]
        .filter(resource =>
            resource.title
                .toLowerCase()
                .includes(
                    searchResource.toLowerCase()
                )
        )
        .sort((a, b) => {
            if (sortOption === "az") {
                return a.title.localeCompare(
                    b.title
                );
            }

            if (sortOption === "za") {
                return b.title.localeCompare(
                    a.title
                );
            }

            if (
                sortOption === "recent"
            ) {
                return (
                    b.lastUpdated -
                    a.lastUpdated
                );
            }

            return 0;
        });

    return (
        <div className="resources-container">

            {/* Page Title */}
            <h1>Resources</h1>

            {/* Search + Sort */}
            <SearchSortBar
                searchValue={
                    searchResource
                }
                onSearchChange={
                    setSearchResource
                }
                sortValue={
                    sortOption
                }
                onSortChange={
                    setSortOption
                }
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

            {/* Resource Counter */}
            <p className="resource-counter">
                Showing{" "}
                {
                    filteredResources.length
                }{" "}
                of{" "}
                {resources.length}{" "}
                resources
            </p>

            {/* Add Resource Form */}
            <div className="add-resource-card">

                <h3>Add Resource</h3>

                <select
                    value={newType}
                    onChange={(e) =>
                        setNewType(
                            e.target.value
                        )
                    }
                >
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

                <input
                    type="text"
                    placeholder="Resource Title"
                    value={newTitle}
                    onChange={(e) => {
                        setNewTitle(
                            e.target.value
                        );

                        setErrorMsg("");
                    }}
                />

                <input
                    type="url"
                    placeholder="Resource URL"
                    value={newUrl}
                    onChange={(e) => {
                        setNewUrl(
                            e.target.value
                        );

                        setErrorMsg("");
                    }}
                />

                {errorMsg && (
                    <p className="error">
                        {errorMsg}
                    </p>
                )}

                <button
                    onClick={
                        addResource
                    }
                >
                    Add Resource
                </button>

            </div>

            {/* Resource Cards */}
            <div className="resources-grid">

                {filteredResources.map(
                    resource => (
                        <div
                            className="resource-card"
                            key={
                                resource.id
                            }
                        >
                            {editingId ===
                            resource.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={
                                            editedTitle
                                        }
                                        onChange={(e) =>
                                            setEditedTitle(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <input
                                        type="url"
                                        value={
                                            editedUrl
                                        }
                                        onChange={(e) =>
                                            setEditedUrl(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <div className="resource-actions">

                                        <button
                                            onClick={() => {
                                                editResource(
                                                    resource.id,
                                                    editedTitle,
                                                    editedUrl
                                                );

                                                setEditingId(
                                                    null
                                                );
                                            }}
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() =>
                                                setEditingId(
                                                    null
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteResource(
                                                    resource.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="resource-type">
                                        {
                                            resource.type
                                        }
                                    </span>

                                    <h3>
                                        {
                                            resource.title
                                        }
                                    </h3>

                                    <div className="resource-actions">

                                        <a
                                            href={
                                                resource.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Open Resource
                                        </a>

                                        <button
                                            onClick={() => {
                                                setEditingId(
                                                    resource.id
                                                );

                                                setEditedTitle(
                                                    resource.title
                                                );

                                                setEditedUrl(
                                                    resource.url
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteResource(
                                                    resource.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </>
                            )}
                        </div>
                    )
                )}

            </div>

        </div>
    );
}

export default Resources;