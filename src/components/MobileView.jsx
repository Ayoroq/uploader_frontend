import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
import backIcon from "/assets/back.svg";
import asc from "/assets/asc.svg";
import desc from "/assets/desc.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import folderIcon from "/assets/Folder.svg";
import addIcon from "/assets/add.svg";
import addFileIcon from "/assets/add-file.svg";
import RenameDialog from "./RenameDialog.jsx";
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
  setFileFolders,
  previewFile,
  searchTerm,
  handleInputChange,
  handleKeyDown,
  handleMobileNav,
  handleDownload,
  handleDelete,
  getSignedUrl,
}) {
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(null);
  const moreDialogRef = useRef(null);
  const renameRef = useRef(null);
  const addItemRef = useRef(null)
  const [content, setContent] = useState(null);
  const [isDropDownOpen,setIsDropDownOpen] = useState(false)
  const dropDownRef = useRef(null)
  const [sortDirection, setSortDirection] = useState('asc')

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
      moreDialogRef.current.showModal();
    }
  }, [isMoreDialogOpen]);

  async function handleShare(id) {
    try {
      const data = await getSignedUrl(id);
      const signedUrl = data.signedUrl;
      navigator.clipboard.writeText(signedUrl);
      alert("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link: ", error);
      alert("Failed to copy link");
    }
  }

  function toggleDropdown(){
    if(isDropDownOpen){
      setIsDropDownOpen(false)
      dropDownRef.current.style.display = 'none'
    }else{
      setIsDropDownOpen(true)
      dropDownRef.current.style.display = 'flex'
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.name}`)
      ) {
        setIsDropDownOpen(false);
        dropDownRef.current.style.display = 'none'
      }
    }

    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen]);

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
          <div className={styles.sortContainer}>
            <button onClick={toggleDropdown} className={styles.sortButton}>
              {sortDirection === 'asc' ? (
                <img src={asc} className={styles.sortIcon} alt="Ascending" />
              ) : (
                <img src={desc} className={styles.sortIcon} alt="Descending" />
              )}
              Name
              </button>
            <div className={styles.dropDown} ref={dropDownRef}>
              <button className={styles.sort}>File Size</button>
              <button className={styles.sort}>Date Modified</button>
              <button className={styles.sort}>Date Created</button>
              <hr />
              <button className={styles.sort}>ASC - DESC</button>
              <button className={styles.sort}> DESC - ASC</button>
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
        {filesFolders.map((fileFolder) => {
          return (
            <Card
              key={fileFolder.id}
              fileFolder={fileFolder}
              onFolderClick={handleFolderClick}
              onFilePreview={previewFile}
              setIsMoreDialogOpen={setIsMoreDialogOpen}
              setContent={setContent}
            />
          );
        })}
      </div>
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
          onClick={() => (addItemRef.current.showModal())}
        >
          <img className={styles.addIcon} src={addIcon} alt="Add" />
        </button>
      </div>
      <dialog className={styles.addItemDialog} ref={addItemRef} closedby="any">
          <div className={styles.fileUploadContainer}>
            <button
              onClick={() => {addItemRef.current.close();dialog.current.showModal()}}
              className={`${styles.containerButton} ${styles.fileUploadButton}`}
            >
              <img
                src={folderIcon}
                alt="Folder"
                className={styles.folderIcon}
              />
              <p className={styles.leftNavText}>Folder</p>
            </button>
            <button
              className={`${styles.containerButton} ${styles.fileUploadButton}`}
              aria-label="Upload files"
              onClick={() => {fileInput.current.click();addItemRef.current.close();}}
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
      </dialog>
      <dialog className={styles.moreDialog} ref={moreDialogRef} closedby="any">
        {content && (
          <div className={styles.moreDialogContainer}>
            <div className={styles.moreDialogHeader}>
              {content.type === "folder" ? (
                <img
                  src={folderIcon}
                  className={styles.moreDialogIcon}
                  alt="Folder icon"
                />
              ) : (
                <img
                  src={content.src}
                  className={styles.moreDialogIcon}
                  alt="File Icon"
                />
              )}
              <div>{content.name}</div>
              <div>
                <p>
                  {content.adjustedDate}
                  {" . "}
                  {content.type === "folder"
                    ? `${
                        content._count.files + content._count.subfolders
                      } Items`
                    : content.adjustedSize}
                </p>
              </div>
            </div>
            <div className={styles.moreDialogButtons}>
              {content.type === "file" && (
                <button
                  onClick={async () => {
                    try {
                      await handleShare(content.id);
                      moreDialogRef.current.close();
                    } catch (error) {
                      console.error("Share failed:", error);
                    }
                  }}
                  className={`${styles.shareButton} ${styles.moreDialogButton}`}
                >
                  Share
                </button>
              )}
              <button
                onClick={async () => {
                  try {
                    await handleDelete(content);
                    moreDialogRef.current.close();
                  } catch (error) {
                    console.error("Delete failed:", error);
                  }
                }}
                className={`${styles.deleteButton} ${styles.moreDialogButton}`}
              >
                Delete
              </button>
              <button
                onClick={async () => {
                  try {
                    await handleDownload(content.id);
                    moreDialogRef.current.close();
                  } catch (error) {
                    console.error("Download failed:", error);
                  }
                }}
                className={`${styles.downloadButton} ${styles.moreDialogButton}`}
              >
                Download
              </button>
              <button
                onClick={() => {
                  moreDialogRef.current.close();
                  renameRef.current.showModal();
                }}
                className={`${styles.renameButton} ${styles.moreDialogButton}`}
              >
                Rename
              </button>
            </div>
          </div>
        )}
      </dialog>
      <RenameDialog
        content={content}
        ref={renameRef}
        filesFolders={filesFolders}
        setFilesFolders={setFileFolders}
      />
    </main>
  );
}
