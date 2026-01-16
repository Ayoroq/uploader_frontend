import { forwardRef, useEffect, useState } from "react";
import styles from "./UploadFileDialog.module.css";
import { formatFileSize } from "../utils/utils.js";
import cancelIcon from '/assets/cancel.svg'

const UploadFileDialog = forwardRef(
  ({ files, handleFileRemove, setFiles, handleUpload, error, setError }, ref) => {
    useEffect(() => {
      if (files.length === 0) {
        ref.current.close();
      }
    }, [files, ref]);

    useEffect(() => {
      const dialogElement = ref.current;
      function handleClose() {
        setFiles([]);
        setError(null);
      }

      if (dialogElement) {
        dialogElement.addEventListener("close", handleClose);
        return () => dialogElement.removeEventListener("close", handleClose);
      }
    }, [ref, setFiles, setError]);
    return (
      <dialog
        closedby="any"
        ref={ref}
        className={styles.dialog}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Upload Files</h2>
          <button className={styles.closeButton} onClick={() => ref.current?.close()}>
            <img className={styles.closeIcon} src={cancelIcon} alt="Close" />
          </button>
        </div>
        <div className={styles.fileCount}>
          {files.length} {files.length === 1 ? 'file' : 'files'} selected
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${index}-${file.name}`} className={styles.fileItem}>
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleFileRemove(index)}
                aria-label="Remove file"
              >
                <img src={cancelIcon} alt="Remove" />
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={() => ref.current?.close()}>
            Cancel
          </button>
          <button className={styles.uploadButton} onClick={handleUpload}>
            Upload {files.length} {files.length === 1 ? 'file' : 'files'}
          </button>
        </div>
      </dialog>
    );
  }
);

UploadFileDialog.displayName = "uploadFileDialog";

export default UploadFileDialog;
