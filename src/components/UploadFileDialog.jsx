import { forwardRef, useEffect } from "react";
import styles from "../pages/AuthHome.module.css";

const UploadFileDialog = forwardRef(
  ({ files, handleFileRemove, setFiles, handleUpload }, ref) => {
    useEffect(() => {
      if (files.length === 0) {
        ref.current.close();
      }
    }, [files, ref]);

    useEffect(() => {
      const dialogElement = ref.current;
      function handleClose() {
        setFiles([]);
      }

      if (dialogElement) {
        dialogElement.addEventListener("close", handleClose);
        return () => dialogElement.removeEventListener("close", handleClose);
      }
    }, [ref, setFiles]);
    return (
      <dialog
        closedby="any"
        ref={ref}
        className={`${styles.fileUploadDialog} ${styles.dialog}`}
      >
        <h2 className={styles.fileUploadTitle}>Upload Files</h2>
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={`${index}-${file.name}`} className={styles.fileItem}>
              <p>{file.name}</p>
              <p>{file.size} bytes</p>
              <button
                className={styles.delete}
                onClick={() => handleFileRemove(index)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.upload} onClick={handleUpload}>
          Upload
        </button>
      </dialog>
    );
  }
);

UploadFileDialog.displayName = "uploadFileDialog";

export default UploadFileDialog;
