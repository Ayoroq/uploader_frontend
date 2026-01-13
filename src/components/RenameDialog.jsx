import { useState, useEffect, forwardRef } from 'react'

const RenameDialog = forwardRef(({ fileFolder, setFileFolder }, ref) => {
    const [newName, setNewName] = useState(fileFolder?.name || '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (fileFolder?.name) {
        setNewName(fileFolder.name);
      }
    }, [fileFolder]);

    const onFolderNameChange = (e) => {
      setNewName(e.target.value)
    };

    async function handleRename() {
      if (!newName.trim()) return;
      
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folders/folder/${fileFolder.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFileFolder(data);
        ref.current?.close();
      }
      setLoading(false);
    }

    return (
      <dialog ref={ref} closedby='any'>
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
            {loading ? 'Renaming...' : 'Confirm'}
          </button>
        </div>
      </dialog>
    );
});

RenameDialog.displayName = 'RenameDialog';
export default RenameDialog;