import { useState, useEffect} from "react";
import initialResources from "../data/resources";

function Resources() {
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

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
                : `https://${formattedUrl}`
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

    return (
        <>
            <h1>Resources</h1>

            <input
                type="text"
                placeholder="Resource Title"
                value={newTitle}
                onChange={(e) => {
                    setNewTitle(e.target.value);
                    setErrorMsg("");
                }}
            />

            <br /><br />

            <input
                type="url"
                placeholder="Resource URL"
                value={newUrl}
                onChange={(e) => {
                    setNewUrl(e.target.value);
                    setErrorMsg("");
                }}
            />

            <br /><br />

            {errorMsg && <p>{errorMsg}</p>}

            <button onClick={addResource}>
                Add Resource
            </button>

            <hr />

            {resources.map(resource => (
                <div key={resource.id}>
                    <h3>{resource.title}</h3>

                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Resource
                    </a>

                    <br /><br />

                    <button
                        onClick={() =>
                            deleteResource(resource.id)
                        }
                    >
                        Delete
                    </button>

                    <hr />
                </div>
            ))}
        </>
    );
}

export default Resources;