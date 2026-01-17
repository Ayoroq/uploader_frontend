import styles from "./FileTableRow.module.css";
import folderIcon from '/assets/Folder.svg';
import shareIcon from '/assets/share.svg';
import downloadIcon from '/assets/download.svg';
import deleteIcon from '/assets/delete.svg';
import renameIcon from '/assets/rename.svg'
import { getFileExtension, convertDate, formatFileSize } from '../utils/utils.js';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

export default function FileTableRow({ item, onFolderClick, onFilePreview, onDelete, onDownload,onShare, setItem, renameRef }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const moreButtonRef = useRef(null)
  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;

      if (spaceBelow < 200) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [showMenu]);

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
        <div className={styles.nameCell}>
          {item.type === "folder" ? (
            <img src={folderIcon} alt="Folder" className={styles.icon}  />
          ) : (
            <img src={getFileExtension(item.name)} alt="File" className={styles.icon} />
          )}
         <p className={styles.itemName}>{item.name}</p>
        </div>
      </td>
      <td><div className={styles.dateCell}>{convertDate(item.updatedAt)}</div></td>
      {item.type === "folder" ? (
        <td><div className={styles.sizeCell}>{item._count.files + item._count.subfolders}</div></td>
      ) : (
        <td><div className={styles.sizeCell}>{formatFileSize(item.size)}</div></td>
      )}
      <td className={styles.moreCell}>
        <div className={styles.moreCellContent}>
          <button onClick={() => {setShowMenu(!showMenu)}} ref={moreButtonRef} className={styles.more}>
            <svg className={styles.moreIcon} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#1f1f1f"><path d="M207.86-432Q188-432 174-446.14t-14-34Q160-500 174.14-514t34-14Q228-528 242-513.86t14 34Q256-460 241.86-446t-34 14Zm272 0Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm272 0Q732-432 718-446.14t-14-34Q704-500 718.14-514t34-14Q772-528 786-513.86t14 34Q800-460 785.86-446t-34 14Z"/></svg>
          </button>
          {showMenu && (
            <div ref={menuRef} className={`${styles.moreMenu} ${position === 'top' ? styles.menuTop : styles.menuBottom}`}>
              {item.type === "folder" ? null : (
                <button onClick={() => { onShare(item.id); setShowMenu(false); }} className={styles.menuButton}>
                  <img src={shareIcon} alt="Share" className={styles.menuIcon} />
                  Share
                </button>
              )}
              <button onClick={() => { setItem(item); setShowMenu(false);renameRef.current.showModal() }} className={styles.menuButton}>
                <img src={renameIcon} alt="Rename" className={styles.menuIcon} />
                Rename
              </button>
              {item.type === "folder" ? null : (
                <button onClick={() => { onDownload(item.id); setShowMenu(false); }} className={styles.menuButton}>
                  <img src={downloadIcon} alt="Download" className={styles.menuIcon} />
                  Download
                </button>
              )}
              <button onClick={() => { onDelete(item); setShowMenu(false); }} className={`${styles.menuButton} ${styles.deleteButton}`}>
                <img src={deleteIcon} alt="Delete" className={styles.menuIcon} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}