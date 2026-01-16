import styles from "../pages/AuthHome.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FileTableRow from "./FileTableRow";
import folderIcon from "/assets/Folder.svg";
import addFileIcon from "/assets/add-file.svg";
import descIcon from "/assets/down.svg";
import ascIcon from "/assets/up.svg";
import RenameDialog from "./RenameDialog";
import { useRef, useState } from "react";

export default function DesktopView({
  fileInput,
  dialog,
  handleFileChange,
  folderPath,
  navigate,
  handleFolderClick,
  loading,
  filesFolders,
  setFilesFolders,
  previewFile,
  handleDownload,
  handleShare,
  handleDelete,
  handleRename,
  setSortBy,
  setSortOrder,
  sortBy,
  sortOrder,
  handleInputChange,
  searchTerm,
}) {
  const renameRef = useRef(null);
  const [item, setItem] = useState(null);

  function handleSortChange(newSortBy) {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
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
          <img
            src={addFileIcon}
            alt={"Add File Icon"}
            className={styles.fileUploadIcon}
          />
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
          <div>
            <input
              type="search"
              className={styles.search}
              placeholder="Search your files"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.contentContainer}>
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
                  <th onClick={() => handleSortChange("name")}>
                    <div className={styles.th}>
                      Name{" "}
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <img
                            className={styles.sortIcon}
                            src={ascIcon}
                            alt="asc"
                          />
                        ) : (
                          <img
                            src={descIcon}
                            className={styles.sortIcon}
                            alt="desc"
                          />
                        ))}
                    </div>
                  </th>
                  <th onClick={() => handleSortChange("date")}>
                    <div className={styles.th}>
                      Modified{" "}
                      {sortBy === "date" &&
                        (sortOrder === "asc" ? (
                          <img
                            className={styles.sortIcon}
                            src={ascIcon}
                            alt="asc"
                          />
                        ) : (
                          <img
                            src={descIcon}
                            className={styles.sortIcon}
                            alt="desc"
                          />
                        ))}
                    </div>
                  </th>
                  <th onClick={() => handleSortChange("size")}>
                    <div className={styles.th}>
                      File Size{" "}
                      {sortBy === "size" &&
                        (sortOrder === "asc" ? (
                          <img
                            className={styles.sortIcon}
                            src={ascIcon}
                            alt="asc"
                          />
                        ) : (
                          <img
                            src={descIcon}
                            className={styles.sortIcon}
                            alt="desc"
                          />
                        ))}
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filesFolders.map((item) => (
                  <FileTableRow
                    key={item.id}
                    item={item}
                    onFolderClick={handleFolderClick}
                    onFilePreview={previewFile}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    setItem={setItem}
                    renameRef={renameRef}
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
      <RenameDialog
        ref={renameRef}
        content={item}
        filesFolders={filesFolders}
        setFilesFolders={setFilesFolders}
      />
    </main>
  );
}
