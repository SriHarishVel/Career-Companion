import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ConfirmModal from "../../components/ConfirmModal";
import LoadingState from "../../components/LoadingState";

import ResourceForm from "./components/ResourceForm";
import ResourceFilters from "./components/ResourceFilters";
import ResourceCard from "./components/ResourceCard";

import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";

import { getSkills } from "../../services/skillService";

import "./index.css";

function Resources() {
  const location = useLocation();

  /* FORM STATE */

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("Documentation");
  const [skillId, setSkillId] = useState(location.state?.skillId || "");

  /* FILTER STATE */

  const [searchResource, setSearchResource] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [filterOption, setFilterOption] = useState("All");

  const [skillFilter, setSkillFilter] = useState(
    location.state?.skillId || "All",
  );

  /* DATA STATE */

  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);

  /* EDIT / DELETE STATE */

  const [editingResourceId, setEditingResourceId] = useState(null);

  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* UI STATE */

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  /* LOAD RESOURCES + SKILLS */

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setErrorMsg("");

        const [resourceData, skillData] = await Promise.all([
          getResources({
            search: searchResource,

            type:
              filterOption === "All" || filterOption === "Favorites"
                ? undefined
                : filterOption,

            favorite: filterOption === "Favorites" ? true : undefined,

            skill: skillFilter === "All" ? undefined : skillFilter,

            sort: sortOption === "default" ? undefined : sortOption,
          }),

          getSkills(),
        ]);

        setResources(resourceData);
        setSkills(skillData);
      } catch (error) {
        console.error("Failed to load resources:", error);

        setErrorMsg("Unable to load your resources. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchResource, filterOption, sortOption, skillFilter]);

  /* HELPERS */

  function getSkillTitle(id) {
    const skill = skills.find((skillItem) => skillItem._id === id);

    return skill ? skill.name : null;
  }

  function getParentGoalTitle(skill) {
    if (!skill.secondaryGoal) {
      return "";
    }

    return skill.secondaryGoal.title;
  }

  function resetResourceForm() {
    setEditingResourceId(null);

    setNewTitle("");
    setNewUrl("");
    setNewType("Documentation");
    setSkillId("");

    setErrorMsg("");
  }

  /* REFRESH RESOURCES */

  async function refreshResources() {
    const resourceData = await getResources({
      search: searchResource,

      type:
        filterOption === "All" || filterOption === "Favorites"
          ? undefined
          : filterOption,

      favorite: filterOption === "Favorites" ? true : undefined,

      skill: skillFilter === "All" ? undefined : skillFilter,

      sort: sortOption === "default" ? undefined : sortOption,
    });

    setResources(resourceData);
  }

  /* EDIT RESOURCE */

  function handleEditResource(resourceId) {
    const resource = resources.find(
      (resourceItem) => resourceItem._id === resourceId,
    );

    if (!resource) {
      return;
    }

    setEditingResourceId(resource._id);

    setNewTitle(resource.title || "");
    setNewUrl(resource.url || "");
    setNewType(resource.type || "Documentation");
    setSkillId(resource.skill?._id || "");

    setErrorMsg("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* CREATE / UPDATE RESOURCE */

  async function addResource() {
    const title = newTitle.trim();
    const url = newUrl.trim();

    if (!title || !url) {
      setErrorMsg("Title and URL cannot be empty.");
      return;
    }

    setErrorMsg("");

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    try {
      if (editingResourceId) {
        await updateResource(editingResourceId, {
          title,
          type: newType,
          url: formattedUrl,
          skill: skillId || null,
        });
      } else {
        await createResource({
          title,
          type: newType,
          url: formattedUrl,
          description: "",
          favorite: false,
          completed: false,
          skill: skillId || null,
        });
      }

      await refreshResources();

      resetResourceForm();
    } catch (error) {
      console.error("Failed to save resource:", error);

      setErrorMsg(
        editingResourceId
          ? "Unable to update the resource. Please try again."
          : "Unable to add the resource. Please try again.",
      );
    }
  }

  /* DELETE RESOURCE */

  function handleDeleteResource(resourceId) {
    setSelectedResourceId(resourceId);
    setShowDeleteModal(true);
  }

  async function confirmDeleteResource() {
    if (!selectedResourceId) {
      return;
    }

    try {
      await deleteResource(selectedResourceId);

      await refreshResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);

      setErrorMsg("Unable to delete the resource. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setSelectedResourceId(null);
    }
  }

  function cancelDeleteResource() {
    setShowDeleteModal(false);
    setSelectedResourceId(null);
  }

  /* TOGGLE FAVORITE */

  async function toggleFavorite(resourceId) {
    const resource = resources.find(
      (resourceItem) => resourceItem._id === resourceId,
    );

    if (!resource) {
      return;
    }

    try {
      await updateResource(resourceId, {
        favorite: !resource.favorite,
      });

      await refreshResources();
    } catch (error) {
      console.error("Failed to update favorite status:", error);

      setErrorMsg("Unable to update the resource. Please try again.");
    }
  }

  /* LOADING */

  if (loading) {
    return (
      <div className="container resources-page">
        <h1>Resources</h1>

        <LoadingState message="Loading your resources..." />
      </div>
    );
  }

  /* PAGE */

  return (
    <div className="container resources-page">
      <h1>
        {skillFilter === "All"
          ? "Resources"
          : `Resources for ${getSkillTitle(skillFilter)}`}
      </h1>

      {errorMsg && (
        <p className="error" role="alert">
          {errorMsg}
        </p>
      )}

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

      <div className="resource-summary">
        <span>
          {resources.length} {resources.length === 1 ? "resource" : "resources"}
        </span>

        <span>
          {resources.filter((resource) => resource.favorite).length} favorites
        </span>
      </div>

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

      <div className="resources-grid">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No Resources Found</h3>

            <p>Add a resource or adjust your filters.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Resource"
        message="Are you sure you want to delete this resource?"
        onConfirm={confirmDeleteResource}
        onCancel={cancelDeleteResource}
      />
    </div>
  );
}

export default Resources;
