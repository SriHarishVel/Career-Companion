import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import LoadingState from "../../components/LoadingState";
import useQueryParams from "../../hooks/useQueryParams";

import ResourceCard from "./components/ResourceCard";
import ResourceFilters from "./components/ResourceFilters";

import { getGoals } from "../../services/goalService";
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

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getResources({
          search: urlSearch || undefined,
          type:
            urlType === "All" || urlType === "Favorites" ? undefined : urlType,
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
        type:
          urlType === "All" || urlType === "Favorites" ? undefined : urlType,
        favorite: urlType === "Favorites" ? true : undefined,
        skill: urlSkill === "All" ? undefined : urlSkill,
        sort: urlSort === "default" ? undefined : urlSort,
      });

      setResources(data);
    } catch (error) {
      console.error("Failed to refresh resources:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to refresh your resources. Please try again.",
      );
    }
  }

  async function handleCreateResource(resourceData) {
    try {
      setErrorMsg("");

      await createResource(resourceData);
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

      await updateResource(resourceId, resourceData);
      await refreshResources();
    } catch (error) {
      console.error("Failed to update resource:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update the resource. Please try again.",
      );
    }
  }

  async function handleDeleteResource(resourceId) {
    try {
      setErrorMsg("");

      await deleteResource(resourceId);
      await refreshResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to delete the resource. Please try again.",
      );
    }
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
              onCreate={handleCreateResource}
              onUpdate={handleUpdateResource}
              onDelete={handleDeleteResource}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No resources found</h3>

            <p>Add a resource or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
