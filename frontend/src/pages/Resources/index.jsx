import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import LoadingState from "../../components/LoadingState";
import useQueryParams from "../../hooks/useQueryParams";

import ResourceCard from "./components/ResourceCard";
import ResourceFilters from "./components/ResourceFilters";
import ResourceForm from "./components/ResourceForm";

import { getGoals } from "../../services/goalService";
import {
  addResourceItem,
  createResource,
  getResources,
  updateResource,
} from "../../services/resourceService";
import { getSkills } from "../../services/skillService";

import "./index.css";

function Resources() {
  const location = useLocation();

  const { getParam, setParams, clearParams } = useQueryParams();

  const urlSearch = getParam("search") || "";
  const urlSort = getParam("sort") || "default";
  const urlType = getParam("type") || "All";
  const urlSkill = getParam("skill") || location.state?.skillId || "All";

  const [searchResource, setSearchResource] = useState(urlSearch);
  const [sortOption, setSortOption] = useState(urlSort);
  const [filterOption, setFilterOption] = useState(urlType);
  const [skillFilter, setSkillFilter] = useState(urlSkill);

  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);

  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newType, setNewType] = useState("Course");
  const [newUrl, setNewUrl] = useState("");
  const [source, setSource] = useState("external");
  const [file, setFile] = useState(null);
  const [skillId, setSkillId] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getResources({
          search: urlSearch || undefined,
          favorite: urlType === "Favorites" ? true : undefined,
          skill: urlSkill === "All" ? undefined : urlSkill,
          sort: urlSort === "default" ? undefined : urlSort,
        });

        setResources(data);
      } catch (error) {
        console.error("Failed to load resources:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load your resources. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [urlSearch, urlType, urlSkill, urlSort]);

  useEffect(() => {
    async function fetchSupportingData() {
      try {
        const [skillData, goalData] = await Promise.all([
          getSkills(),
          getGoals(),
        ]);

        setSkills(skillData);
        setGoals(goalData);
      } catch (error) {
        console.error("Failed to load resource data:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load resource data. Please try again.",
        );
      }
    }

    fetchSupportingData();
  }, []);

  function applyFilters() {
    setParams({
      search: searchResource || "",
      sort: sortOption === "default" ? "" : sortOption,
      type: filterOption === "All" ? "" : filterOption,
      skill: skillFilter === "All" ? "" : skillFilter,
    });
  }

  function clearFilters() {
    setSearchResource("");
    setSortOption("default");
    setFilterOption("All");
    setSkillFilter("All");

    clearParams(["search", "sort", "type", "skill"]);
  }

  function getParentGoalTitle(skill) {
    if (!skill?.secondaryGoal) {
      return "";
    }

    const parentGoalId =
      typeof skill.secondaryGoal === "object"
        ? skill.secondaryGoal.parentGoal?._id || skill.secondaryGoal.parentGoal
        : null;

    if (!parentGoalId) {
      return "";
    }

    const parentGoal = goals.find((goal) => goal._id === parentGoalId);

    return parentGoal ? parentGoal.title : "";
  }

  async function refreshResources() {
    try {
      setErrorMsg("");

      const data = await getResources({
        search: urlSearch || undefined,
        favorite: urlType === "Favorites" ? true : undefined,
        skill: urlSkill === "All" ? undefined : urlSkill,
        sort: urlSort === "default" ? undefined : urlSort,
      });

      setResources(data);
    } catch (error) {
      console.error("Failed to refresh resources:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to refresh resources. Please try again.",
      );
    }
  }

  function resetResourceForm() {
    setNewTitle("");
    setNewItemTitle("");
    setNewType("Course");
    setNewUrl("");
    setSource("external");
    setFile(null);
    setSkillId("");
    setErrorMsg("");
  }

  function openResourceForm() {
    resetResourceForm();
    setIsResourceFormOpen(true);
  }

  function closeResourceForm() {
    setIsResourceFormOpen(false);
    resetResourceForm();
  }

  async function addResource() {
    try {
      setErrorMsg("");

      if (!newTitle.trim()) {
        setErrorMsg("Resource title is required.");
        return;
      }

      if (!newItemTitle.trim()) {
        setErrorMsg("Resource item title is required.");
        return;
      }

      if (source === "external" && !newUrl.trim()) {
        setErrorMsg("Resource item URL is required.");
        return;
      }

      if (source === "upload" && !file) {
        setErrorMsg("Please select a file.");
        return;
      }

      const resourceData = {
        title: newTitle.trim(),
        skill: skillId || null,
      };

      const createdResource = await createResource(resourceData);

      const itemFormData = new FormData();

      itemFormData.append("title", newItemTitle.trim());
      itemFormData.append("type", newType);

      if (source === "external") {
        const formattedUrl = newUrl.trim().startsWith("http")
          ? newUrl.trim()
          : `https://${newUrl.trim()}`;

        itemFormData.append("url", formattedUrl);
      } else {
        itemFormData.append("file", file);
      }

      await addResourceItem(createdResource._id, itemFormData);

      closeResourceForm();
      await refreshResources();
    } catch (error) {
      console.error("Failed to create resource:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to create the resource. Please try again.",
      );
    }
  }

  async function handleUpdateResource(resourceId, resourceData) {
    try {
      setErrorMsg("");

      const updatedResource = await updateResource(resourceId, resourceData);

      await refreshResources();

      return updatedResource;
    } catch (error) {
      console.error("Failed to update resource:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update the resource. Please try again.",
      );

      throw error;
    }
  }

  async function handleToggleFavorite(resourceId) {
    const resource = resources.find((item) => item._id === resourceId);

    if (!resource) {
      return;
    }

    await handleUpdateResource(resourceId, {
      favorite: !resource.favorite,
    });
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Resources</h1>

        <LoadingState message="Loading your resources..." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Resources</h1>

        <button
          type="button"
          className="btn-primary"
          onClick={openResourceForm}
        >
          Add Resource
        </button>
      </div>

      {errorMsg && (
        <div className="resource-error-message" role="alert">
          {errorMsg}
        </div>
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
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <div className="resources-grid">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No resources found</h3>

            <p>Add a resource or adjust your filters.</p>
          </div>
        )}
      </div>

      <ResourceForm
        isOpen={isResourceFormOpen}
        onClose={closeResourceForm}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newItemTitle={newItemTitle}
        setNewItemTitle={setNewItemTitle}
        newType={newType}
        setNewType={setNewType}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
        source={source}
        setSource={setSource}
        file={file}
        setFile={setFile}
        skillId={skillId}
        setSkillId={setSkillId}
        skills={skills}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        addResource={addResource}
      />
    </div>
  );
}

export default Resources;