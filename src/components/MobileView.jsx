import styles from "./MobileView.module.css";
import Card from "./Card.jsx";
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
      <div className={styles.cards}>
        {filesFolders.map((fileFolder, index) => {
          return <Card key={index} fileFolder={fileFolder} onFolderClick={handleFolderClick} onFilePreview={previewFile} />;
        })}
      </div>
    </main>
  );
}
