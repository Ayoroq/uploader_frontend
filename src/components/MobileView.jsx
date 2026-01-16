import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
import backIcon from "/assets/back.svg";
import asc from "/assets/asc.svg";
import desc from "/assets/desc.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import folderIcon from "/assets/Folder.svg";
import addIcon from "/assets/add.svg";
import addFileIcon from "/assets/add-file.svg";
import shareIcon from "/assets/share.svg";
import downloadIcon from "/assets/download.svg";
import deleteIcon from "/assets/delete.svg";
import renameIcon from "/assets/rename.svg"
import RenameDialog from "./RenameDialog.jsx";
import activeIcon from '/assets/check.svg'

import { useRef, useState, useEffect } from "react";

export default function MobileView({
  className,
  fileInput,
  dialog,
  handleFileChange,
  folderPath,
  handleFolderClick,
  loading,
  filesFolders,
  setFilesFolders,
  previewFile,
  searchTerm,
  handleInputChange,
  handleMobileNav,
  handleDownload,
  handleDelete,
  handleShare,
  setSortBy,
  setSortOrder,
  sortBy,
  sortOrder
}) {
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(null);
  const moreDialogRef = useRef(null);
  const renameRef = useRef(null);
  const addItemRef = useRef(null)
  const [content, setContent] = useState(null);
  const [isDropDownOpen,setIsDropDownOpen] = useState(false)
  const dropDownRef = useRef(null)
  const sortOptions = [
    {value:'name', label:'Name'},
    {value:'size', label:'File Size'},
    {value:'date', label:'Date Modified'}
  ]
  const sortTerm = sortOptions.find(option => option.value === sortBy)?.label || 'Name';

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
        !event.target.closest(`.${styles.sortButton}`)
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
              {sortOrder === 'asc' ? (
                <img src={asc} className={styles.sortIcon} alt="Ascending" />
              ) : (
                <img src={desc} className={styles.sortIcon} alt="Descending" />
              )}
              {sortTerm}
              </button>
            <div className={styles.dropDown} ref={dropDownRef}>
              <button onClick={() => { setSortBy('name'); toggleDropdown(); }} className={styles.sort}>
                {sortOptions[0].label}
                {sortBy === 'name' && <img className={styles.activeIcon} src={activeIcon} alt="active"/>}
              </button>
              <button onClick={() => { setSortBy('size'); toggleDropdown(); }} className={styles.sort}>
                {sortOptions[1].label}
                {sortBy === 'size' && <img className={styles.activeIcon} src={activeIcon} alt="active"/>}
              </button>
              <button onClick={() => { setSortBy('date'); toggleDropdown(); }} className={styles.sort}>
                {sortOptions[2].label}
                {sortBy === 'date' && <img className={styles.activeIcon} src={activeIcon} alt="active"/>}
              </button>
              <hr />
              <button onClick={() => { setSortOrder('asc'); toggleDropdown(); }} className={styles.sort}>
                Asc
                {sortOrder === 'asc' && <img className={styles.activeIcon} src={activeIcon} alt="active"/>}
              </button>
              <button onClick={() => { setSortOrder('desc'); toggleDropdown(); }} className={styles.sort}>
                Desc
                {sortOrder === 'desc' && <img className={styles.activeIcon} src={activeIcon} alt="active"/>}
              </button>
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
              <h3 className={styles.moreDialogName}>{content.name}</h3>
              <p className={styles.moreDialogInfo}>
                {content.adjustedDate} • {content.type === "folder"
                  ? `${content._count.files + content._count.subfolders} ${content._count.files + content._count.subfolders === 1 ? 'item' : 'items'}`
                  : content.adjustedSize}
              </p>
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
                  <img src={shareIcon} alt="Share" />
                  Share
                </button>
              )}
              <button
                onClick={() => {
                  moreDialogRef.current.close();
                  renameRef.current.showModal();
                }}
                className={`${styles.renameButton} ${styles.moreDialogButton}`}
              >
                <img src={renameIcon} alt="Rename" />
                Rename
              </button>
              {content.type === 'file' && (
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
                  <img src={downloadIcon} alt="Download" />
                  Download
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
                <img src={deleteIcon} alt="Delete" />
                Delete
              </button>
            </div>
          </div>
        )}
      </dialog>
      <RenameDialog
        content={content}
        ref={renameRef}
        filesFolders={filesFolders}
        setFilesFolders={setFilesFolders}
      />
    </main>
  );
}
