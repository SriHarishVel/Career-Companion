import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import ResourceForm from "./components/ResourceForm";
import ResourceFilters from "./components/ResourceFilters";
import ResourceCard from "./components/ResourceCard";
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
                    getResources({
                        search: searchResource,
                        type:
                            filterOption === "All" ||
                            filterOption === "Favorites"
                                ? undefined
                                : filterOption,
                        favorite:
                            filterOption === "Favorites"
                                ? true
                                : undefined,
                        skill:
                            skillFilter === "All"
                                ? undefined
                                : skillFilter,
                        sort:
                            sortOption === "default"
                                ? undefined
                                : sortOption,
                    }),
                    getSkills(),
                ]);

                setResources(resources);
                setSkills(skills);

            } catch (error) {

                console.error(error);

            }

        }

        fetchData();

    }, [
        searchResource,
        filterOption,
        sortOption,
        skillFilter,
    ]);

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

    return (
        <div className="container">
            <h1>
                {skillFilter === "All"
                    ? "Resources"
                    : `Resources for ${getSkillTitle(skillFilter)}`}
            </h1>

            <ResourceFilters
                searchResource={searchResource}
                setSearchResource={setSearchResource}
                sortOption={sortOption}
                setSortOption={setSortOption}
                filterOption={filterOption}
                setFilterOption={setFilterOption}
                skillFilter={skillFilter}
                setSkillFilter={setSkillFilter}
                skills={skills}
                getParentGoalTitle={getParentGoalTitle}
            />
            {/* Resource Counter */}
            <p className="resource-counter">
                Showing of {resources.length}resources
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
            <ResourceForm
                editingResourceId={editingResourceId}
                newType={newType}
                setNewType={setNewType}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newUrl={newUrl}
                setNewUrl={setNewUrl}
                skillId={skillId}
                setSkillId={setSkillId}
                skills={skills}
                errorMsg={errorMsg}
                addResource={addResource}
            />

            {/* Resource Cards */}
            <div className="resources-grid">

                {resources.length > 0 ? (
                    resources.map(resource => (
                        <ResourceCard
                            key={resource._id}
                            resource={resource}
                            onEdit={handleEditResource}
                            onDelete={(resourceId) => {
                                setSelectedResourceId(resourceId);
                                setShowDeleteModal(true);
                            }}
                            onToggleFavorite={toggleFavorite}
                        />
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
                    onConfirm={confirmDeleteResource}
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