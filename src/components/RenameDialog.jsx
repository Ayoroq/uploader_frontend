import { useState, useEffect, forwardRef, useRef } from "react";
import { useNavigate } from "react-router";
import styles from "./RenameDialog.module.css";

const RenameDialog = forwardRef(
  ({ content, filesFolders, setFilesFolders }, ref) => {
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
      if (content?.name) {
        const nameOnly =
          content.name.split(".").slice(0, -1).join(".") || content.name;
        setNewName(nameOnly);
      }
    }, [content]);

    useEffect(() => {
      const dialog = ref.current;
      const handleOpen = () => {
        inputRef.current?.focus();
      };

      if (dialog) {
        dialog.addEventListener('open', handleOpen);
        return () => dialog.removeEventListener('open', handleOpen);
      }
    }, [ref]);

    const onFolderNameChange = (e) => {
      setNewName(e.target.value);
    };

    useEffect(() => {
      const dialogElement = ref.current;

      function handleClose() {
        setLoading(false);
        setError(null);
        setNewName("");
      }

      if (dialogElement) {
        dialogElement.addEventListener("close", handleClose);
        return () => dialogElement.removeEventListener("close", handleClose);
      }
    }, [ref]);

    async function handleRename() {
      if (!content?.id || !newName.trim()) return;

      setLoading(true);

      const extension = content.name?.split(".").pop() || "";
      const finalName =
        extension && content.name.includes(".")
          ? `${newName}.${extension}`
          : newName;
      const url =
        content?.type === "folder"
          ? `${import.meta.env.VITE_API_URL}/api/folders/update/folder/${
              content.id
            }`
          : `${import.meta.env.VITE_API_URL}/api/files/${content.id}`;

      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: finalName }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the specific item in fileFolder array
        console.log(content)
        const updatedFileFolder = filesFolders.map((item) =>
          item.id === content.id ? { ...item, name: finalName } : item
        );
        setFilesFolders(updatedFileFolder);

        ref.current?.close();
        setLoading(false);
        return;
      }

      const statusRoutes = { 401: "/login", 403: "/403" };
      if (statusRoutes[response.status]) {
        navigate(statusRoutes[response.status]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.errors?.[0]?.msg || data.message || 'Failed to rename';
        setError(errorMsg);
      }
      setLoading(false);
    }

    return (
      <dialog ref={ref} closedby="any" className={styles.dialog}>
        <div className={styles.header}>
          <h2 className={styles.title}>Rename</h2>
          <button
            onClick={() => ref.current?.close()}
            className={styles.closeButton}
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="8.58782"
                x2="8.58782"
                y2="0.5"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <line
                x1="1.20711"
                y1="0.5"
                x2="9.29492"
                y2="8.58782"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.inputWrapper}>
            <label htmlFor="renameName" className={styles.label}>
              New Name
            </label>
            <input
              ref={inputRef}
              id="renameName"
              type="text"
              value={newName}
              required
              onChange={onFolderNameChange}
              className={styles.input}
            />
            {error && (
              <p className={styles.error}>{error}</p>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={() => ref.current?.close()}
          >
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleRename}
            disabled={loading || !newName.trim()}
          >
            {loading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </dialog>
    );
  }
);

RenameDialog.displayName = "RenameDialog";
export default RenameDialog;
