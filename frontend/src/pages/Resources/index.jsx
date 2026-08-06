import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchSortBar from "../../components/SearchSortBar";
import ConfirmModal from "../../components/ConfirmModal";
import {
    getResources,
    createResource,
    updateResource,
    deleteResource
} from "../../services/resourceService";
import { getSkills } from "../../services/skillService";
import "./index.css";

function Resources() {
    const location = useLocation();

    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newType, setNewType] = useState("Documentation");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchResource, setSearchResource] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [filterOption, setFilterOption] = useState("All");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const [resources, setResources] = useState([]);
    const [skillId, setSkillId] = useState(
        location.state?.skillId || ""
    );
    const [skillFilter, setSkillFilter] = useState(
        location.state?.skillId || "All"
    );

    const [skills, setSkills] = useState([]);
    const [editingResourceId, setEditingResourceId] = useState(null);

    useEffect(() => {

        async function fetchData() {

            try {

                const [
                    resources,
                    skills,
                ] = await Promise.all([
                    getResources(),
                    getSkills(),
                ]);

                setResources(resources);
                setSkills(skills);

            } catch (error) {
                console.error(error);
            }

        }

        fetchData();

    }, []);

    function getSkillTitle(skillId) {
        const skill = skills.find(
            skill => skill._id === skillId
        );

        return skill
            ? skill.name
            : null;
    }

    function getParentGoalTitle(skill) {
        if (!skill.secondaryGoal) {
            return "";
        }

        return skill.secondaryGoal.title;
    }

    function handleEditResource(resourceId) {

        const resource = resources.find(
            resource => resource._id === resourceId
        );

        if (!resource) {
            return;
        }

        setEditingResourceId(resource._id);

        setNewTitle(resource.title);
        setNewUrl(resource.url);
        setNewType(resource.type);
        setSkillId(
            resource.skill?._id || ""
        );

        setErrorMsg("");

    }

    async function addResource() {

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
            newUrl.trim().startsWith("http")
                ? newUrl.trim()
                : `https://${newUrl.trim()}`;

        if (editingResourceId) {

            try {

                await updateResource(
                    editingResourceId,
                    {
                        title: newTitle.trim(),
                        type: newType,
                        url: formattedUrl,
                        skill: skillId || null
                    }
                );

                const resources =
                    await getResources();

                setResources(resources);

            } catch (error) {
                console.error(error);
            }

            setEditingResourceId(null);
            setNewTitle("");
            setNewUrl("");
            setNewType("Documentation");
            setSkillId("");
            setErrorMsg("");

            return;
        }

        try {

            await createResource({
                title: newTitle.trim(),
                type: newType,
                url: formattedUrl,
                description: "",
                favorite: false,
                completed: false,
                skill: skillId || null
            });

            const resources =
                await getResources();

            setResources(resources);

            setNewTitle("");
            setNewUrl("");
            setNewType("Documentation");
            setSkillId("");

        } catch (error) {
            console.error(error);
        }

    }

    async function confirmDeleteResource() {

        try {

            await deleteResource(
                selectedResourceId
            );

            const resources =
                await getResources();

            setResources(resources);

        } catch (error) {
            console.error(error);
        }

        setShowDeleteModal(false);
        setSelectedResourceId(null);

    }

    async function toggleFavorite(resourceId) {

        try {

            const resource = resources.find(
                resource => resource._id === resourceId
            );

            await updateResource(
                resourceId,
                {
                    favorite: !resource.favorite
                }
            );

            const updatedResources =
                await getResources();

            setResources(updatedResources);

        } catch (error) {
            console.error(error);
        }

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
        .filter(resource => {
            if (filterOption === "All") {
                return true;
            }

            if (filterOption === "Favorites") {
                return resource.favorite;
            }

            return (
                resource.type ===
                filterOption
            );
        })
        .filter(resource =>
            skillFilter === "All"
                ? true
                : resource.skill?._id === skillFilter
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

            if (sortOption === "recent") {
                return (
                    new Date(b.updatedAt) -
                    new Date(a.updatedAt)
                );

            }

            return 0;
        });

    return (
        <div className="container">
            <h1>
                {skillFilter === "All"
                    ? "Resources"
                    : `Resources for ${getSkillTitle(skillFilter)}`}
            </h1>

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
            
            {/* Filter Dropdown */}
            <select
                value={filterOption}
                onChange={(e) =>
                    setFilterOption(
                        e.target.value
                    )
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
                onChange={(e) => setSkillFilter(e.target.value)}
            >
                <option value="All">All Skills</option>

                {skills.map(skill => (
                    <option
                        key={skill._id}
                        value={skill._id}
                    >
                        {`${getParentGoalTitle(skill)} → ${skill.name}`}
                    </option>
                ))}
            </select>
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
            
            {/* Favorite Counter */}
            <p className="resource-counter">
                Favorites: {
                    resources.filter(
                        resource =>
                            resource.favorite
                    ).length
                }
            </p>

            {/* Add Resource Form */}
            <div className="add-resource-card">

                <h3>
                    {editingResourceId
                        ? "Edit Resource"
                        : "Add Resource"}
                </h3>

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

                <select
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                >
                    <option value="">
                        Related Skill (Optional)
                    </option>

                    {skills.map(skill => (
                        <option
                            key={skill._id}
                            value={skill._id}
                        >
                            {skill.name}
                        </option>
                    ))}
                </select>

                {errorMsg && (
                    <p className="error">
                        {errorMsg}
                    </p>
                )}

                <button onClick={addResource}>
                    {editingResourceId
                        ? "Update Resource"
                        : "Add Resource"}
                </button>
                
                {editingResourceId && (
                    <button
                        className="cancel-btn"
                        onClick={() => {
                            setEditingResourceId(null);
                            setNewTitle("");
                            setNewUrl("");
                            setNewType("Documentation");
                            setSkillId("");
                            setErrorMsg("");
                        }}
                    >
                        Cancel Edit
                    </button>
                )}

            </div>

            {/* Resource Cards */}
            <div className="resources-grid">

                {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                        <div
                            className="resource-card"
                            key={resource._id}
                        >
                            <>
                                <span className="resource-type">
                                    {resource.type}
                                </span>

                                {resource.favorite && (
                                    <span className="favorite-badge">
                                        ★ Favorite
                                    </span>
                                )}

                                {resource.skill && (
                                    <p className="related-skill">
                                        Skill: {resource.skill.name}
                                    </p>
                                )}

                                <h3>
                                    {resource.title}
                                </h3>

                                <div className="resource-actions">

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Resource
                                    </a>

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEditResource(resource._id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            setSelectedResourceId(resource._id);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="favorite-btn"
                                        onClick={() =>
                                            toggleFavorite(resource._id)
                                        }
                                    >
                                        {resource.favorite
                                            ? "Unfavorite"
                                            : "Favorite"}
                                    </button>

                                </div>
                            </>

                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No Resources found</h3>

                        <p>
                            Add a resource or adjust
                            your filters.
                        </p>
                    </div>
                )}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Resource"
                    message="Are you sure you want to delete this resource?"
                    onConfirm={
                        confirmDeleteResource
                    }
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedResourceId(null);
                    }}
                />
                </div>

            </div>
    );
}

export default Resources;