import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
import filterIcon from "/assets/filter.svg";
import backIcon from "/assets/back.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import addIcon from '/assets/add.svg'
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
  handleKeyDown
}) {
  return (
    <main className={`${styles.mobileView} ${className || ""}`}>
      {folderPath && (
        <>
          <div className={styles.backButtonContainer}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <img className={styles.backIcon} src={backIcon} alt="back" />
            </button>
          </div>
          <div>
            <p className={styles.folderName}>{folderPath.at(-1).name}</p>
          </div>
        </>
      )}
      {filesFolders.length > 0 ? (
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
              key={index}
              fileFolder={fileFolder}
              onFolderClick={handleFolderClick}
              onFilePreview={previewFile}
            />
          );
        })}
      </div>
      <div className={styles.addContainer}>
        <input type="search" className={styles.search} placeholder="Search your files" value={searchTerm} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <button className={styles.addButton} onClick={fileInput}>
          <img className={styles.addIcon} src={addIcon} alt="Add" />
        </button>
      </div>
    </main>
  );
}
