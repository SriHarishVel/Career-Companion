import { API_BASE_URL } from "../../../api/axios";

function ResourcePreview({ source, file }) {
  if (source !== "upload" || !file?.filename) {
    return null;
  }

  const fileUrl = `${API_BASE_URL}/uploads/resources/${file.filename}`;

  if (file.mimeType?.startsWith("image/")) {
    return (
      <section className="resource-preview">
        <h2>Preview</h2>

        <div className="resource-preview-content">
          <img src={fileUrl} alt={file.originalName || "Uploaded resource"} />
        </div>
      </section>
    );
  }

  if (file.mimeType?.startsWith("video/")) {
    return (
      <section className="resource-preview">
        <h2>Preview</h2>

        <div className="resource-preview-content">
          <video controls>
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support video playback.
          </video>
        </div>
      </section>
    );
  }

  if (file.mimeType?.startsWith("audio/")) {
    return (
      <section className="resource-preview">
        <h2>Preview</h2>

        <div className="resource-preview-content">
          <audio controls>
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support audio playback.
          </audio>
        </div>
      </section>
    );
  }

  if (file.mimeType === "application/pdf") {
    return (
      <section className="resource-preview">
        <h2>Preview</h2>

        <div className="resource-preview-content">
          <iframe src={fileUrl} title={file.originalName || "PDF preview"} />
        </div>
      </section>
    );
  }

  return (
    <section className="resource-preview">
      <h2>Preview</h2>

      <div className="resource-preview-unavailable">
        <p>Preview is not available for this file type.</p>
        <span>{file.originalName}</span>
      </div>
    </section>
  );
}

export default ResourcePreview;
