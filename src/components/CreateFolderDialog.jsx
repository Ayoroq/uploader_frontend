import { forwardRef, useCallback, useEffect, useRef } from "react";
import styles from "./CreateFolderDialog.module.css";
import cancelIcon from '/assets/cancel.svg'

const CreateFolderDialog = forwardRef(({ folderName, setFolderName, folderNameError, onFolderNameChange, onFolderCreate, error, setError },ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
      const dialog = ref.current;
      const handleOpen = () => {
        inputRef.current?.focus();
      };

      function handleClose() {
        setError(null);
        setFolderName("");
      };

      if (dialog) {
        dialog.addEventListener('open', handleOpen);
        dialog.addEventListener('close', handleClose);
        return () => {
          dialog.removeEventListener('open', handleOpen);
          dialog.removeEventListener('close', handleClose);
        };
      }
    }, [ref, setError,setFolderName]);

    const handleCloseClick = useCallback(() => {
      ref.current.close();
    }, [ref]);

    return (
      <dialog ref={ref} className={styles.dialog} closedby="any">
        <div className={styles.header}>
          <h2 className={styles.title}>Create Folder</h2>
          <button
            onClick={handleCloseClick}
            className={styles.closeButton}
            aria-label="Close"
          >
            <img className={styles.cancelIcon} src={cancelIcon} alt="Close" />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.inputWrapper}>
            <label htmlFor="folderName" className={styles.label}>
              Folder Name
            </label>
            <input
              ref={inputRef}
              id="folderName"
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              required
              onChange={onFolderNameChange}
              className={styles.input}
            />
            {folderNameError && !folderName && (
              <p className={styles.error}>{folderNameError}</p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={handleCloseClick}
          >
            Cancel
          </button>
          <button
            className={styles.createButton}
            onClick={onFolderCreate}
            disabled={!folderName.trim()}
          >
            Create Folder
          </button>
        </div>
      </dialog>
    );
  }
);

CreateFolderDialog.displayName = "CreateFolderDialog";

export default CreateFolderDialog;
