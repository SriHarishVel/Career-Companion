import { useState, useEffect} from "react";
import initialResources from "../../data/resources";
import "./index.css"

function Resources() {
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [searchResource, setSearchResource] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [resources, setResources] = useState(() => {
        const savedResources = localStorage.getItem("resources");

        if (savedResources) {
            return JSON.parse(savedResources);
        }

        return initialResources;
    });

    useEffect(() => {
        localStorage.setItem("resources", JSON.stringify(resources));
    }, [resources]);

    function addResource() {
        if (newTitle.trim() === "" || newUrl.trim() === "") {
            setErrorMsg("Title and URL cannot be empty.");
            return;
        }

        setErrorMsg("");
        const formattedUrl = newUrl.trim();
        setResources(prevResources => [
            ...prevResources,
            {
                id: Date.now(),
                title: newTitle.trim(),
                url: formattedUrl.startsWith("http")
                    ? formattedUrl
                    : `https://${formattedUrl}`,
                lastUpdated: Date.now()
            }
        ]);

        setNewTitle("");
        setNewUrl("");
    }

    function deleteResource(resourceId) {
        setResources(prevResources =>
            prevResources.filter(
                resource => resource.id !== resourceId
            )
        );
    }
    
    const filteredResources = [...resources]
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
            if (sortOption === "recent") {
                return (
                    b.lastUpdated -
                    a.lastUpdated
                );
            }

            return 0;
        });


    return (
        <div className="container">
            <h1>Resources</h1>
            <input 
                type = "search" 
                placeholder="Search resources" 
                value={searchResource}
                onChange={(e)=>
                    setSearchResource(e.target.value)
                }
            />
            <select
                value={sortOption}
                onChange={(e) =>
                    setSortOption(
                        e.target.value
                    )
                }
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
            </select>

            <input
                type="text"
                placeholder="Resource Title"
                value={newTitle}
                onChange={(e) => {
                    setNewTitle(e.target.value);
                    setErrorMsg("");
                }}
            />

            <input
                type="url"
                placeholder="Resource URL"
                value={newUrl}
                onChange={(e) => {
                    setNewUrl(e.target.value);
                    setErrorMsg("");
                }}
            />

            {errorMsg && <p className="error">{errorMsg}</p>}

            <button onClick={addResource}>
                Add Resource
            </button>

            {filteredResources.map(resource => (
                <div
                    className="resource-card"
                    key={resource.id}
                >
                    <h3>{resource.title}</h3>

                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Resource
                    </a>

                    <br />

                    <button
                        onClick={() =>
                            deleteResource(resource.id)
                        }
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Resources;