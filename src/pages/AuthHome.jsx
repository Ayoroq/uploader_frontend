import styles from "./AuthHome.module.css";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UploadFileDialog from "../components/UploadFileDialog";
import CreateFolderDialog from "../components/CreateFolderDialog";
import FilePreviewDialog from "../components/FilePreviewDialog";
import DesktopView from "../components/DesktopView";
import MobileView from "../components/MobileView";

export default function AuthHome() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const fileInput = useRef(null);
  const dialog = useRef(null);
  const fileDialog = useRef(null);
  const previewDialog = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);
  const [filesFolders, setFilesFolders] = useState([]);
  const [folderNameError, setFolderNameError] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folderPath, setFolderPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);

  // This is for when trying to upload files
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    fileDialog.current.showModal();

    e.target.value = null;
  }

  function handleInputChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim() === "") {
        return;
      }
    }
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

  function handleMobileNav() {
    if (folderPath && folderPath.length > 1) {
      const parentFolderId = folderPath[folderPath.length - 2].id;
      navigate(`/folders/${parentFolderId}`);
    } else {
      navigate(`/`);
    }
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

  // This is used to get signed URL for a file
  async function getSignedUrl(id) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/files/${id}/preview`,
      {
        credentials: "include",
      }
    );
    const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
    if (statusRoutes[response.status]) {
      navigate(statusRoutes[response.status]);
      return null;
    }
    const data = await response.json();
    return data.url;
  }

  // This is used to preview a file
  async function previewFile(id) {
    const fileData = await getSignedUrl(id);
    if (fileData) {
      setPreviewData(fileData);
      if (previewDialog.current) {
        previewDialog.current.showModal();
      } else {
        console.warn("previewDialog ref is not attached to a DOM element.");
      }
    }
  }

  // This is used to download a file
  async function handleFileDownload(id, fileUrl=null, fileName=null) {
    try {
      if(id && (!fileUrl || !fileName)) {
        const signedUrl = await getSignedUrl(id);
        fileUrl = signedUrl.url;
        fileName = signedUrl.fileName;
      }
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
    }
  }

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
    <>
      <DesktopView
        fileInput={fileInput}
        dialog={dialog}
        handleFileChange={handleFileChange}
        folderPath={folderPath}
        navigate={navigate}
        handleFolderClick={handleFolderClick}
        loading={loading}
        filesFolders={filesFolders}
        previewFile={previewFile}
      />
      <MobileView
        className={styles.mobileView}
        fileInput={fileInput}
        dialog={dialog}
        handleFileChange={handleFileChange}
        folderPath={folderPath}
        navigate={navigate}
        handleFolderClick={handleFolderClick}
        loading={loading}
        filesFolders={filesFolders}
        previewFile={previewFile}
        searchTerm={searchTerm}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleMobileNav={handleMobileNav}
        handleDownload={handleFileDownload}
      />
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
      <FilePreviewDialog
        ref={previewDialog}
        file={previewData}
        onClose={() => previewDialog.current.close()}
        setPreviewData={setPreviewData}
        onDownload={handleFileDownload}
      />
    </>
  );
}
// TODO: complete the mobile view implementation
// TODO: add the edit, delete and share functionality
// TODO: add the sort and filter
//TODO: Add checks and better error handling e.t.c
