import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
import filterIcon from "/assets/filter.svg";
import backIcon from "/assets/back.svg";
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
}) {
  return (
    <main className={`${styles.mobileView} ${className || ""}`}>
        {folderPath && (<header>
            <div>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <img className={styles.backIcon} src={backIcon} alt="back" />
                </button>
            </div>
        </header>)}
      {filesFolders.length > 0 && <nav className={styles.nav}>
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
            <img className={styles.filterIcon} src={filterIcon} alt="filter" />
          </button>
          <div className={styles.dropDown}>
            <button>Grid</button>
            <button>Table</button>
          </div>
        </div>
      </nav>}
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
    </main>
  );
}
