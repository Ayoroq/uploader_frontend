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
      <td>
        <button className={styles.more}>
          <svg className={styles.moreIcon} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f"><path d="M207.86-432Q188-432 174-446.14t-14-34Q160-500 174.14-514t34-14Q228-528 242-513.86t14 34Q256-460 241.86-446t-34 14Zm272 0Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm272 0Q732-432 718-446.14t-14-34Q704-500 718.14-514t34-14Q772-528 786-513.86t14 34Q800-460 785.86-446t-34 14Z"/></svg>
        </button>
      </td>
    </tr>
  );
}