import { useState, useEffect, forwardRef } from 'react'

const RenameDialog = forwardRef(({ content,filesFolders, setFilesFolders }, ref) => {
    const [newName, setNewName] = useState(content?.name || '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (content?.name) {
        setNewName(content.name);
      }
    }, [content]);

    const onFolderNameChange = (e) => {
      setNewName(e.target.value)
    };

    async function handleRename() {
      if (!newName.trim()) return;
      
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folders/folder/${content.id}`,
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
        
        // Update the specific item in fileFolder array
        const updatedFileFolder = filesFolders.map(item => 
          item.id === content.id ? { ...item, name: newName } : item
        );
        setFilesFolders(updatedFileFolder);
        
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