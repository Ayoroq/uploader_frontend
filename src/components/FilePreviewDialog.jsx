import { forwardRef, useEffect } from "react";
import styles from "./FilePreviewDialog.module.css";

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
          className={styles.contentItem}
        />
      );
    }

    if (file.mimeType === "application/pdf") {
      return (
        <iframe
          src={file.signedUrl}
          title={file.name}
          className={styles.contentItem}
        />
      );
    }

    if (file.mimeType.startsWith("video/")) {
      return (
        <video
          controls
          src={file.signedUrl}
          className={styles.contentItem}
        />
      );
    }

    if (file.mimeType.startsWith("audio/")) {
      return <audio controls src={file.signedUrl} className={styles.contentItem} />;
    }

    //unsupported files
    return (
      <div className={styles.unsupportedFile}>
        <p>Preview not available for this file type.</p>
        <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
    );
  };

  return (
    <dialog ref={ref} className={styles.previewDialog} closedby="any">
      <header>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
      </header>

      <section className={styles.content}>{renderPreview()}</section>

      <footer></footer>
    </dialog>
  );
});

FilePreviewDialog.displayName = "FilePreviewDialog";
export default FilePreviewDialog;
