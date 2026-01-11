import { forwardRef, useCallback } from "react";
import styles from "../pages/AuthHome.module.css";

const CreateFolderDialog = forwardRef(({ folderName, folderNameError, onFolderNameChange, onFolderCreate },ref) => {
    const handleClose = useCallback(() => {
      ref.current.close();
    }, [ref]);

    return (
      <dialog ref={ref} className={styles.dialog} closedby="any">
        <div className={styles.dialogHeader}>
          <p>Create a folder</p>
          <button
            onClick={() => ref.current.close()}
            className={styles.closeDialogButton}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Group 5">
                <line
                  id="Line 10"
                  x1="0.5"
                  y1="8.58782"
                  x2="8.58782"
                  y2="0.5"
                  stroke="black"
                  strokeLinecap="round"
                />
                <line
                  id="Line 11"
                  x1="1.20711"
                  y1="0.5"
                  x2="9.29492"
                  y2="8.58782"
                  stroke="black"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter your folder name"
            value={folderName}
            required
            onChange={onFolderNameChange}
            autoFocus
          />
          {folderNameError && !folderName && (
            <p className={styles.error}>{folderNameError}</p>
          )}
        </div>
        <div className={styles.createFolderButtonContainer}>
          <button
            className={styles.createFolderButton}
            onClick={onFolderCreate}
          >
            Create
          </button>
        </div>
      </dialog>
    );
  }
);

CreateFolderDialog.displayName = "CreateFolderDialog";

export default CreateFolderDialog;
