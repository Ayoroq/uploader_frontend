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
  const [error, setError] = useState(null)
  const [folderName, setFolderName] = useState("");
  const [folderPath, setFolderPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedFilesFolders = [...filesFolders].sort((a, b) => {
    // This allows folders to come first
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;

    // Then sort by selected criteria
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (sortBy === "size") {
      const aSize = a.size || 0;
      const bSize = b.size || 0;
      return sortOrder === "asc" ? aSize - bSize : bSize - aSize;
    }
    return 0;
  });

  const displayedFilesFolders = searchTerm
    ? sortedFilesFolders.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedFilesFolders;

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
          name: folderName,
          parentFolderId: folderId,
        }),
        credentials: "include",
      });

      const statusRoutes = { 401: "/login", 403: "/403", 404: "/404" };
      if (statusRoutes[response.status]) {
        navigate(statusRoutes[response.status]);
        return;
      }

      if(!response.ok){
        const data = await response.json();
        const errorMsg = data.errors?.[0]?.msg || data.message || 'Failed to create folder';
        setError(errorMsg);
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

  // This is used to share a file
  async function handleShare(id) {
    try {
      const data = await getSignedUrl(id);
      if (data) {
        const signedUrl = data.signedUrl;
        await navigator.clipboard.writeText(signedUrl);
        alert("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Failed to copy link: ", error);
      alert("Failed to copy link");
    }
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
  async function handleFileDownload(id, fileUrl = null, fileName = null) {
    try {
      if (id && (!fileUrl || !fileName)) {
        const response = await getSignedUrl(id);
        fileUrl = response.signedUrl;
        fileName = response.name;
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

  async function handleFileFolderDelete(fileFolder) {
    try {
      if (!fileFolder?.id) return;
      setDeleteLoading(true);
      const url =
        fileFolder?.type === "folder"
          ? `${import.meta.env.VITE_API_URL}/api/folders/delete/folder/${
              fileFolder.id
            }`
          : `${import.meta.env.VITE_API_URL}/api/files/${fileFolder.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedFileFolder = filesFolders.filter(
          (item) => item.id !== fileFolder.id
        );
        setFilesFolders(updatedFileFolder);
      }
      if (response.status === 401) navigate("/login");
      if (response.status === 403) navigate("/403");
      if (!response.ok) {
        const data = await response.json();
      }
      setDeleteLoading(false);
    } catch (error) {
      console.error(error);
      setDeleteLoading(false);
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
        filesFolders={displayedFilesFolders}
        setFilesFolders={setFilesFolders}
        previewFile={previewFile}
        handleDownload={handleFileDownload}
        handleDelete={handleFileFolderDelete}
        handleShare={handleShare}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        sortBy={sortBy}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleInputChange={handleInputChange}
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
        filesFolders={displayedFilesFolders}
        setFilesFolders={setFilesFolders}
        previewFile={previewFile}
        searchTerm={searchTerm}
        handleInputChange={handleInputChange}
        handleMobileNav={handleMobileNav}
        handleDownload={handleFileDownload}
        handleDelete={handleFileFolderDelete}
        handleShare={handleShare}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        sortBy={sortBy}
        sortOrder={sortOrder}
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
        error={error}
        setError={setError}
        setFolderName={setFolderName}
      />
      <FilePreviewDialog
        ref={previewDialog}
        file={previewData}
        onClose={() => previewDialog.current.close()}
        setPreviewData={setPreviewData}
        onDownload={handleFileDownload}
        onDelete={handleFileFolderDelete}
        onShare={handleShare}
      />
    </>
  );
}
