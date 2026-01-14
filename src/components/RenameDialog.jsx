import { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router";

const RenameDialog = forwardRef(
  ({ content, filesFolders, setFilesFolders }, ref) => {
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      if (content?.name) {
        const nameOnly =
          content.name.split(".").slice(0, -1).join(".") || content.name;
        setNewName(nameOnly);
      }
    }, [content]);

    const onFolderNameChange = (e) => {
      setNewName(e.target.value);
    };

    useEffect(() => {
      const dialogElement = ref.current;

      function handleClose() {
        setLoading(false);
        setErrors({});
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
        const updatedFileFolder = filesFolders.map((item) =>
          item.id === content.id ? { ...item, name: finalName } : item
        );
        setFilesFolders(updatedFileFolder);

        ref.current?.close();
      }
      if (response.status === 401) navigate("/login");
      if (response.status === 403) navigate("/403");
      if (!response.ok) {
        const data = await response.json();
        setErrors(data.message);
      }
      setLoading(false);
    }

    return (
      <dialog ref={ref} closedby="any">
        <div>
          <h1>Rename</h1>
        </div>
        <div>
          <input
            type="text"
            value={newName}
            required
            onChange={onFolderNameChange}
            autoFocus
          />
        </div>
        <div>
          <button onClick={() => ref.current?.close()}>Cancel</button>
          <button onClick={handleRename} disabled={loading}>
            {loading ? "Renaming..." : "Confirm"}
          </button>
        </div>
        {errors && <p>{errors.message}</p>}
      </dialog>
    );
  }
);

RenameDialog.displayName = "RenameDialog";
export default RenameDialog;
