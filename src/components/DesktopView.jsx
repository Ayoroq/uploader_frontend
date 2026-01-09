import styles from "../pages/AuthHome.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FileTableRow from "./FileTableRow";
import folderIcon from '/assets/Folder.svg';

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
              <g data-name="Layer 2">
                <g data-name="file-add">
                  <rect width="24" height="24" opacity="0"></rect>
                  <path d="M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2zm.71-7a.79.79 0 0 1-.71-.85V4l3.74 4z"></path>
                </g>
              </g>
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
    </main>
  );
}