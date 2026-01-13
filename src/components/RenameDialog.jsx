export default function RenameDialog({}){
    return(
       <dialog>
        <div>
            <h1>Rename</h1>
        </div>
        <div>
            <input
            type="text"
            value={folderName}
            required
            onChange={onFolderNameChange}
            autoFocus
          />
        </div>
        <div>
            <button>Cancel</button>
            <button onClick={onFolderCreate}>Confirm</button>
        </div>
       </dialog>
    )
}