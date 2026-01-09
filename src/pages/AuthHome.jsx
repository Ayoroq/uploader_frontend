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
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
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

        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
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
      const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
      if (statusRoutes[response.status]) {
        navigate(statusRoutes[response.status]);
        return;
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

      const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
      if (statusRoutes[response.status]) {
        navigate(statusRoutes[response.status]);
        return;
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

  // This is used to preview a file
  async function previewFile(id){
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/files/${id}/preview`, {
      credentials: "include",
    });
    const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
    if (statusRoutes[response.status]) {
      navigate(statusRoutes[response.status]);
      return;
    }
    const data = await response.json();
    window.open(data.url.signedUrl, "_blank");
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
        const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
        if (statusRoutes[response.status]) {
          navigate(statusRoutes[response.status]);
          return;
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
              {!folderPath && <p className={styles.myFilesRoot}>My Files</p>}
              {folderPath && (
                <div className={styles.breadCrumbs}>
                  <button
                    className={styles.breadCrumbsButton}
                    onClick={() => navigate("/")}
                  >
                    My Files
                  </button>
                  {folderPath.length > 0 && <span> {">"} </span>}
                  {folderPath.map((item, index) => (
                    <div key={item.id}>
                      <button
                        className={styles.breadCrumbsButton}
                        onClick={() => handleFolderClick(item.id)}
                      >
                        {item.name}
                      </button>
                      {index < folderPath.length - 1 && <span> {">"} </span>}
                    </div>
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
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loading}>
                <DotLottieReact
                  src="/assets/loading.lottie"
                  loop={true}
                  autoplay={true}
                  className={styles.loadingLottie}
                />
            </div>
          ) : filesFolders.length > 0 ? (
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
                    onFilePreview={previewFile}
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
// TODO: add file preview
// TODO: add the edit, delete and share functionality
// TODO: add the sort and filter
//TODO: Add checks and better error handling e.t.c
