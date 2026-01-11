import styles from "../pages/AuthHome.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FileTableRow from "./FileTableRow";
import folderIcon from '/assets/Folder.svg';
import addFileIcon from '/assets/add-file.svg';

export default function DesktopView({
  fileInput,
  dialog,
  handleFileChange,
  folderPath,
  navigate,
  handleFolderClick,
  loading,
  filesFolders,
  previewFile
}) {
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
          <img src={addFileIcon} alt={"Add File Icon"} className={styles.fileUploadIcon} />
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
    </main>
  );
}