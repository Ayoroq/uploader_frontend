import styles from "./AuthHome.module.css";
import { useRef, useState, useEffect} from "react";
import { useParams } from "react-router";

export default function AuthHome() {
  const { folderId } = useParams();
  const fileInput = useRef(null);
  const dialog = useRef(null);
  const [files, setFiles] = useState([]);
  const [filesFolders, setFilesFolders] = useState([]);
  const [folderNameError, setFolderNameError] = useState(null)
  const [folderName, setFolderName] = useState("")

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    e.target.value = null;
  }

  function handleFileRemove(index) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  function handleFolderNameChange(e) {
    setFolderName(e.target.value)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/all`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setFilesFolders(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const dialogElement = dialog.current;
    const handleClose = () => {
      setFolderName("");
      setFolderNameError(null);
    };
    
    if (dialogElement) {
      dialogElement.addEventListener('close', handleClose);
      return () => dialogElement.removeEventListener('close', handleClose);
    }
  }, []);

  async function handleUpload() {
    if (files) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const uploadUrl = folderId
          ? `${import.meta.env.VITE_API_URL}/upload/${folderId}`
          : `${import.meta.env.VITE_API_URL}/upload`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleCreateFolder() {
    if (folderName) {
      try {
        const uploadUrl = folderId ? `${import.meta.env.VITE_API_URL}/api/folders/create/folder/${folderId}` : `${import.meta.env.VITE_API_URL}/api/folders/create/folder`
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderName }),
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        setFolderName("");
        dialog.current.close();
      } catch (error) {
        console.error(error);
      }
    } else {
      setFolderNameError("Folder name is required")
    }
  }

  return (
    <main className={styles.authhome}>
      <section>
        <button onClick={() => (dialog.current.showModal())}>Folder</button>
        <button
          className={styles.import}
          aria-label="Upload files"
          onClick={() => fileInput.current.click()}
        >
          Files Upload
        </button>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          ref={fileInput}
          className={styles.fileInput}
          multiple
          onChange={handleFileChange}
        />
      </section>
      <section>
        <ul>
          {files.map((file, index) => (
            <li key={`${index}-${file.name}`}>
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
      </section>
      <section>
        {files.length > 0 && (
          <button className={styles.upload} onClick={handleUpload}>
            Upload
          </button>
        )}
      </section>
      <dialog ref={dialog} className={styles.dialog} closedby="any">
        <div>
            <p>Create a folder</p>
            <button onClick={() => {dialog.current.close()}}>Cancel</button>
        </div>
        <div>
            <input type="text" placeholder="Enter your folder name" value={folderName} required onChange={handleFolderNameChange} autoFocus />
            {folderNameError && <p>{folderNameError}</p>}
        </div>
        <div>
            <button onClick={handleCreateFolder}>Create</button>
        </div>
      </dialog>
    </main>
  );
}
