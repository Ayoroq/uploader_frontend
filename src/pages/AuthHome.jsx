import styles from "./AuthHome.module.css";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UploadFileDialog from "../components/UploadFileDialog";
import CreateFolderDialog from "../components/CreateFolderDialog";
import FileTableRow from "../components/FileTableRow";
import folderIcon from "/assets/Folder.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AuthHome() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const fileInput = useRef(null);
  const dialog = useRef(null);
  const fileDialog = useRef(null);
  const [files, setFiles] = useState([]);
  const [filesFolders, setFilesFolders] = useState([]);
  const [folderNameError, setFolderNameError] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folderPath, setFolderPath] = useState(null);

  // This is for when trying to upload files
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    fileDialog.current.showModal();

    e.target.value = null;
  }

  function handleFileRemove(index) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  function handleFolderNameChange(e) {
    setFolderName(e.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const requests = [
          fetch(
            folderId
              ? `${import.meta.env.VITE_API_URL}/api/folders/folder/${folderId}`
              : `${import.meta.env.VITE_API_URL}/api/all`,
            { credentials: "include" }
          ),
        ];

        if (folderId) {
          requests.push(
            fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/folders/folder/${folderId}/path`,
              { credentials: "include" }
            )
          );
        }

        const responses = await Promise.all(requests);
        const [dataResponse, pathResponse] = responses;

        if (!dataResponse.ok || (pathResponse && !pathResponse.ok)) {
          console.error(
            "API request failed:",
            dataResponse.status,
            pathResponse?.status
          );
          return;
        }

        const data = await dataResponse.json();
        if (pathResponse) {
          const pathData = await pathResponse.json();
          setFolderPath(pathData.path);
        }

        folderId
          ? setFilesFolders(data.filesAndFolders)
          : setFilesFolders(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [folderId, navigate]);

  // This is for the closing of the dialog for folder name
  useEffect(() => {
    const dialogElement = dialog.current;
    const handleClose = () => {
      setFolderName("");
      setFolderNameError(null);
    };

    if (dialogElement) {
      dialogElement.addEventListener("close", handleClose);
      return () => dialogElement.removeEventListener("close", handleClose);
    }
  }, []);

  // this is used to handle folder click to navigate to the subfolder
  async function handleFolderClick(folderId) {
    if (folderId === "null") return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folders/folder/${folderId}/path`,
        {
          credentials: "include",
        }
      );
      if (response.status === 401) {
        navigate("/login");
      }
      if (response.status === 403) {
        navigate("/403");
      }
      if (response.status === 404) {
        navigate("/404");
      }
      const data = await response.json();
      setFolderPath(data.path);
    } catch (error) {
      console.error(error);
    }
    navigate(`/folders/${folderId}`);
  }

  // This is used to create a new folder
  async function handleCreateFolder() {
    if (!folderName) {
      setFolderNameError("Folder name is required");
      return;
    }

    try {
      const url = folderId
        ? `${
            import.meta.env.VITE_API_URL
          }/api/folders/create/folder/${folderId}`
        : `${import.meta.env.VITE_API_URL}/api/folders/create/folder`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderName: folderName,
          parentFolderId: folderId,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
      }
      if (response.status === 403) {
        navigate("/403");
      }
      if (response.status === 404) {
        navigate("/404");
      }

      let data = await response.json();
      data = data.folder;
      dialog.current.close();
      setFolderName("");
      setFolderNameError(null);
      data._count = { files: 0, subfolders: 0 };
      data.type = "folder";
      setFilesFolders((prevFilesFolders) => [...prevFilesFolders, data]);
    } catch (error) {
      console.error(error);
    }
  }

  // This is used for the file upload management
  async function handleFileUpload() {
    if (files) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const uploadUrl = folderId
          ? `${import.meta.env.VITE_API_URL}/api/upload/${folderId}`
          : `${import.meta.env.VITE_API_URL}/api/upload`;

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (response.status === 401) {
          navigate("/login");
        }
        if (response.status === 403) {
          navigate("/403");
        }
        if (response.status === 404) {
          navigate("/404");
        }
        if (response.ok) {
          fileDialog.current.close();
          setFiles([]);
          const data = await response.json();
          setFilesFolders((prevFilesFolders) => [
            ...prevFilesFolders,
            ...data.files.map((fileObj) => fileObj.file),
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <main className={styles.authhome}>
      <section className={styles.leftSide}>
        <button
          onClick={() => dialog.current.showModal()}
          className={`${styles.leftNavButton} ${styles.fileUploadButton}`}
        >
          <img src={folderIcon} alt="Folder" className={styles.folderIcon} />
          <p className={styles.leftNavText}>Folder</p>
        </button>
        <button
          className={`${styles.leftNavButton} ${styles.fileUploadButton}`}
          aria-label="Upload files"
          onClick={() => fileInput.current.click()}
        >
          <svg
            fill="#000000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.fileUploadIcon}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g data-name="Layer 2">
                {" "}
                <g data-name="file-add">
                  {" "}
                  <rect width="24" height="24" opacity="0"></rect>{" "}
                  <path d="M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2zm.71-7a.79.79 0 0 1-.71-.85V4l3.74 4z"></path>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
          <p className={styles.leftNavText}>Files Upload</p>
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
      <section className={styles.rightSide}>
        <div className={styles.miniNav}>
          <div className={styles.folderPath}>
            <div>
              {!folderPath && <p>My Files</p>}
              {folderPath && (
                <div className={styles.folderPath}>
                  <span onClick={() => navigate("/")}>
                    My Files
                    {folderPath.length > 0 && <span> {"-->"} </span>}
                  </span>
                  {folderPath.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => handleFolderClick(item.id)}
                    >
                      {item.name}

                      {index < folderPath.length - 1 && <span> {"-->"} </span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.sortView}>
            <p>Sort</p>
            <p>View</p>
          </div>
        </div>
        <div className={styles.filesFolders}>
          {filesFolders.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Modified</th>
                  <th>File Size</th>
                </tr>
              </thead>
              <tbody>
                {filesFolders.map((item) => (
                  <FileTableRow
                    key={item.id}
                    item={item}
                    onFolderClick={handleFolderClick}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>The Folder is empty</p>
              <DotLottieReact
                src="/assets/empty.lottie"
                autoplay={true}
                className={styles.emptyLottie}
              />
              <p>
                Upload files or create folders to access them from any device
              </p>
            </div>
          )}
        </div>
      </section>
      <UploadFileDialog
        ref={fileDialog}
        files={files}
        handleFileRemove={handleFileRemove}
        setFiles={setFiles}
        handleUpload={handleFileUpload}
      />
      <CreateFolderDialog
        ref={dialog}
        folderName={folderName}
        folderNameError={folderNameError}
        onFolderNameChange={handleFolderNameChange}
        onFolderCreate={handleCreateFolder}
      />
    </main>
  );
}
