import {
  getFileExtension,
  convertDate,
  formatFileSize,
} from "../utils/utils.js";
import folderIcon from "/assets/Folder.svg";
import styles from "./Card.module.css";

export default function Card({
  fileFolder,
  onFolderClick,
  onFilePreview,
  onFileDownload,
  setIsMoreDialogOpen,
  setContent
}) {
  function handleClick() {
    if (fileFolder.type === "folder") {
      onFolderClick(fileFolder.id);
    } else {
      onFilePreview(fileFolder.id);
    }
  };

  function handleMoreClick() {
    setIsMoreDialogOpen(true);
    const src = getFileExtension(fileFolder.name)
    const adjustedDate = convertDate(fileFolder.updatedAt)
    const adjustedSize = formatFileSize(fileFolder.size)
    setContent({...fileFolder, src,adjustedDate,adjustedSize});
  }

  return (
    <div className={styles.card}>
      <div className={styles.details} onClick={handleClick}>
        <div className={styles.icon}>
          {fileFolder.type === "folder" ? (
            <img className={styles.folder} src={folderIcon} alt="Folder" />
          ) : (
            <img
              className={styles.file}
              src={getFileExtension(fileFolder.name)}
              alt="File"
            />
          )}
        </div>
        <div>
          {fileFolder.name}
          <p className={styles.info}>
            Modified <span>{convertDate(fileFolder.updatedAt)}</span> .
            {fileFolder.type === "folder" ? (
              <span>
                {fileFolder._count.files + fileFolder._count.subfolders} items
              </span>
            ) : (
              <span> {formatFileSize(fileFolder.size)}</span>
            )}
          </p>
        </div>
      </div>
      <div className={styles.moreContainer }>
        <button className={styles.more} onClick={handleMoreClick}>
            <svg className={styles.moreIcon} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f"><path d="M207.86-432Q188-432 174-446.14t-14-34Q160-500 174.14-514t34-14Q228-528 242-513.86t14 34Q256-460 241.86-446t-34 14Zm272 0Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm272 0Q732-432 718-446.14t-14-34Q704-500 718.14-514t34-14Q772-528 786-513.86t14 34Q800-460 785.86-446t-34 14Z"/></svg>
        </button>
      </div>
    </div>
  );
}
