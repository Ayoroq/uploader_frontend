import styles from "../pages/AuthHome.module.css";

export default function FileTableRow({ item, onFolderClick }) {
  return (
    <tr key={item.id}>
      <td
        onClick={
          item.type === "folder"
            ? () => onFolderClick(item.id)
            : undefined
        }
        className={
          item.type === "folder" ? styles.folder : styles.file
        }
      >
        {item.name}
      </td>
      <td>{item.updatedAt}</td>
      {item.type === "folder" ? (
        <td>{item._count.files + item._count.subfolders}</td>
      ) : (
        <td>{item.size}</td>
      )}
    </tr>
  );
}