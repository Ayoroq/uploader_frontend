import { forwardRef, useEffect } from "react";

const FilePreviewDialog = forwardRef(({ file, onClose, setPreviewData }, ref) => {
  // Handle dialog close events
  useEffect(() => {
    const dialogElement = ref.current;
    function handleClose() {
      setPreviewData(null);
    }  
    if (dialogElement) {
      dialogElement.addEventListener("close", handleClose);
      return () => dialogElement.removeEventListener("close", handleClose);
    }
  }, [ref, setPreviewData]);



  const renderPreview = () => {
    if (!file) return <p>No file selected</p>;
    
    if (file.mimeType.startsWith("image/")) {
      return (
        <img
          src={file.signedUrl}
          alt={file.name}
        />
      );
    }

    if (file.mimeType === "application/pdf") {
      return (
        <iframe
          src={file.signedUrl}
          title={file.name}
        />
      );
    }

    if (file.mimeType.startsWith("video/")) {
      return (
        <video
          controls
          src={file.signedUrl}
        />
      );
    }

    if (file.mimeType.startsWith("audio/")) {
      return <audio controls src={file.signedUrl} />;
    }

    //unsupported files
    return (
      <div>
        <p>Preview not available for this file type.</p>
        <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
    );
  };

  return (
    <dialog ref={ref} className="file-preview-dialog" closedby="any">
      {/* Header */}
      <header>
        <h2></h2>
        <button onClick={onClose}>✕</button>
      </header>

      {/* Preview content */}
      <section className="preview-content">{renderPreview()}</section>

      {/* Footer */}
      <footer></footer>
    </dialog>
  );
});

FilePreviewDialog.displayName = "FilePreviewDialog";
export default FilePreviewDialog;
