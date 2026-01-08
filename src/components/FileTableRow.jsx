import styles from "./FileTableRow.module.css";
import csvIcon from '/assets/CSV Icon.svg';
import docxIcon from '/assets/Docx SVG Icon.svg';
import fileIcon from '/assets/File Alt Vector Icon.svg';
import jpgIcon from '/assets/Jpg Vector Icon.svg';
import excelIcon from '/assets/Microsoft Excel Icon.svg';
import pdfIcon from '/assets/PDF File 2 Icon.svg';
import pngIcon from '/assets/Png Vector Icon.svg';
import pptxIcon from '/assets/Pptx PowerPoint Icon.svg';
import zipIcon from '/assets/File Zip Icon.svg';
import svgIcon from '/assets/SVG Icon from SVG Repo.svg';
import folderIcon from '/assets/Folder.svg';


const fileIcons = {
  csv: csvIcon,
  docx: docxIcon,
  file: fileIcon,
  jpg: jpgIcon,
  jpeg: jpgIcon,
  png: pngIcon,
  pdf: pdfIcon,
  pptx: pptxIcon,
  zip: zipIcon,
  xlsx: excelIcon,
  xls: excelIcon,
  default: fileIcon,
  svg: svgIcon
};

function getFileExtension(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return fileIcons[ext] || fileIcons.default;
}

export default function FileTableRow({ item, onFolderClick }) {
  return (
    <tr key={item.id} className={styles.row}>
      <td
        onClick={
          item.type === "folder"
            ? () => onFolderClick(item.id)
            : undefined
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
      <td>{item.updatedAt}</td>
      {item.type === "folder" ? (
        <td>{item._count.files + item._count.subfolders}</td>
      ) : (
        <td>{item.size}</td>
      )}
    </tr>
  );
}