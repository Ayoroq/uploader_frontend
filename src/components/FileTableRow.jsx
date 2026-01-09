import styles from "./FileTableRow.module.css";
import folderIcon from '/assets/Folder.svg';
import { getFileExtension, convertDate, formatFileSize } from '../utils/utils.js';
export default function FileTableRow({ item, onFolderClick, onFilePreview }) {
  return (
    <tr key={item.id} className={styles.row}>
      <td
        onClick={
          item.type === "folder"
            ? () => onFolderClick(item.id)
            : () => onFilePreview(item.id)
        }
        className={
          `${item.type === "folder" ? styles.folder : styles.file} ${styles.rowItem}`
        }
      >
        {item.type === "folder" ? (
          <img src={folderIcon} alt="Folder" className={styles.icon}  />
        ) : (
          <img src={getFileExtension(item.name)} alt="File" className={styles.icon} />
        )}
        {item.name}
      </td>
      <td>{convertDate(item.updatedAt)}</td>
      {item.type === "folder" ? (
        <td>{item._count.files + item._count.subfolders}</td>
      ) : (
        <td>{formatFileSize(item.size)}</td>
      )}
    </tr>
  );
}