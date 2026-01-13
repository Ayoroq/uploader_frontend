import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
import filterIcon from "/assets/filter.svg";
import backIcon from "/assets/back.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import folderIcon from "/assets/Folder.svg";
import addIcon from "/assets/add.svg";
import addFileIcon from "/assets/add-file.svg";
import { useRef, useState, useEffect } from "react";

export default function MobileView({
  className,
  fileInput,
  dialog,
  handleFileChange,
  folderPath,
  navigate,
  handleFolderClick,
  loading,
  filesFolders,
  previewFile,
  searchTerm,
  handleInputChange,
  handleKeyDown,
  handleMobileNav,
}) {
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(null);
  const moreDialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        moreDialogRef.current &&
        !moreDialogRef.current.contains(event.target)
      ) {
        setIsMoreDialogOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreDialogRef]);

  useEffect(() => {
    if (isMoreDialogOpen) {
        moreDialogRef.current.showModal()
    }
  }, [isMoreDialogOpen])

  return (
    <main className={`${styles.mobileView} ${className || ""}`}>
      {folderPath && (
        <>
          <div className={styles.backButtonContainer}>
            <button
              className={styles.backButton}
              onClick={() => handleMobileNav()}
            >
              <img className={styles.backIcon} src={backIcon} alt="back" />
            </button>
          </div>
          <div>
            <p className={styles.folderName}>
              {folderPath?.length > 0 ? folderPath.at(-1).name : ""}
            </p>
          </div>
        </>
      )}
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
        <nav className={styles.nav}>
          <div>
            <button className={styles.name}>Name</button>
            <div className={styles.dropDown}>
              <button className={styles.sort}>File Size</button>
              <button className={styles.sort}>Date Modified</button>
              <button className={styles.sort}>Date Created</button>
              <hr />
              <button className={styles.sort}>A - Z</button>
              <button className={styles.sort}> Z - A</button>
            </div>
          </div>
          <div>
            <button className={styles.filter}>
              <img
                className={styles.filterIcon}
                src={filterIcon}
                alt="filter"
              />
            </button>
            <div className={styles.dropDown}>
              <button>Grid</button>
              <button>Table</button>
            </div>
          </div>
        </nav>
      ) : (
        <div className={styles.mobileEmptyState}>
          <p className={styles.emptyText}>The Folder is empty</p>
          <DotLottieReact
            src="/assets/empty.lottie"
            autoplay={true}
            className={styles.emptyLottie}
          />
          <p>Upload files or create folders to access them from any device</p>
        </div>
      )}
      <div className={styles.cards}>
        {filesFolders.map((fileFolder, index) => {
          return (
            <Card
              key={fileFolder.id}
              fileFolder={fileFolder}
              onFolderClick={handleFolderClick}
              onFilePreview={previewFile}
              isMoreDialogOpen={isMoreDialogOpen}
              setIsMoreDialogOpen={setIsMoreDialogOpen}
            />
          );
        })}
      </div>
      <div className={styles.container}>
        <div className={styles.addContainer}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search your files"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.addButton}
            onClick={() => fileInput.current.click()}
          >
            <img className={styles.addIcon} src={addIcon} alt="Add" />
          </button>
        </div>
        <div className={styles.fileUploadContainer}>
          <button
            onClick={() => dialog.current.showModal()}
            className={`${styles.containerButton} ${styles.fileUploadButton}`}
          >
            <img src={folderIcon} alt="Folder" className={styles.folderIcon} />
            <p className={styles.leftNavText}>Folder</p>
          </button>
          <button
            className={`${styles.containerButton} ${styles.fileUploadButton}`}
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
        </div>
      </div>
      <dialog className={styles.moreDialog} ref={moreDialogRef} closedby="any">
        <p>
          This contains information about the files and the different folders
        </p>
        <p>This is also a test</p>
      </dialog>
    </main>
  );
}
