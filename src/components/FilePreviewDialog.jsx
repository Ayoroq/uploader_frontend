import { forwardRef, useEffect } from "react";
import styles from "./FilePreviewDialog.module.css";
import shareIcon from "/assets/share.svg";
import downloadIcon from "/assets/download.svg";
import deleteIcon from "/assets/delete.svg";
import cancelIcon from "/assets/cancel.svg";

const FilePreviewDialog = forwardRef(
  ({ file, onClose, setPreviewData, onDownload, onDelete, onShare }, ref) => {
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

    async function handleShare() {
      try {
        await onShare(file.id);
        // Close the dialog after sharing
        if (ref.current) {
          ref.current.close();
        }
      } catch (error) {
        console.error("Error sharing file:", error)
      }
    }

    async function handleDelete() {
      try {
        await onDelete(file.id);
        // Close the dialog after deleting
        if (ref.current) {
          ref.current.close();
        }
      } catch (error) {
        console.error("Error deleting file:", error)
      }
    }

    function renderPreview() {
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
          <video controls src={file.signedUrl} className={styles.contentItem} />
        );
      }

      if (file.mimeType.startsWith("audio/")) {
        return (
          <audio controls src={file.signedUrl} className={styles.contentItem} />
        );
      }

      if (
        file.mimeType.startsWith("text/") ||
        file.mimeType === "application/json" ||
        file.mimeType === "application/javascript"
      ) {
        return (
          <iframe
            src={file.signedUrl}
            title={file.name}
            className={styles.contentItem}
          />
        );
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
    }

    return (
      <dialog ref={ref} className={styles.previewDialog} closedby="any">
        <header className={styles.header}>
          <div className={styles.iconContainer}>
            <img
              onClick={() => onDownload(null, file.signedUrl, file.name)}
              className={`${styles.icon} ${styles.downloadIcon}`}
              src={downloadIcon}
              alt="Download File Icon"
            />
            <img
              onClick={handleDelete}
              className={`${styles.icon} ${styles.deleteIcon}`}
              src={deleteIcon}
              alt="Delete File Icon"
            />
          </div>
          <div className={styles.title}>
            <p className={styles.titleText}>{file?.name}</p>
          </div>
          <div className={styles.iconContainer}>
            <p onClick={handleShare} className={styles.shareButton}>
              <img
                className={`${styles.icon} ${styles.shareIcon}`}
                src={shareIcon}
                alt="Share File Icon"
              />
              <span className={styles.shareText}>Share</span>
            </p>
            <button className={styles.closeButton} onClick={onClose}>
              <img
                className={`${styles.icon} ${styles.cancelIcon}`}
                src={cancelIcon}
                alt="Cancel Icon"
              />
            </button>
          </div>
        </header>

        <section className={styles.content}>{renderPreview()}</section>

        <footer></footer>
      </dialog>
    );
  }
);

FilePreviewDialog.displayName = "FilePreviewDialog";
export default FilePreviewDialog;
