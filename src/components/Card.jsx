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
}) {
  const handleClick = () => {
    if (fileFolder.type === "folder") {
      onFolderClick(fileFolder.id);
    } else {
      onFilePreview(fileFolder.id);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    onFileDownload(fileFolder.signedUrl, fileFolder.name);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.details}>
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
            Modified <span>{convertDate(fileFolder.updatedAt)}</span>.
            {fileFolder.type === "folder" ? (
              <span>
                {fileFolder._count.files + fileFolder._count.subfolders} items
              </span>
            ) : (
              <span>{formatFileSize(fileFolder.size)}</span>
            )}
          </p>
        </div>
      </div>
      {fileFolder.type === "file" && (
        <button onClick={handleDownload}>Download</button>
      )}
    </div>
  );
}
