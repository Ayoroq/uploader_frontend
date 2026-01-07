import { forwardRef, useEffect } from "react";
import styles from "../pages/AuthHome.module.css";

const UploadFileDialog = forwardRef(({ files, handleFileRemove,setFiles }, ref) => {
  useEffect(() => {
    if (files.length === 0) {
      ref.current.close();
    }
  }, [files, ref]);

  useEffect(() => {
    const dialogElement = ref.current;
   function handleClose() {
      setFiles([]);
    }   
    
    if (dialogElement) {
      dialogElement.addEventListener('close', handleClose);
      return () => dialogElement.removeEventListener('close', handleClose);
    }
  }, [ref, setFiles]);
  return (
    <dialog closedby="any" ref={ref}>
      <ul>
        {files.map((file, index) => (
          <li key={`${index}-${file.name}`}>
            <p>{file.name}</p>
            <p>{file.size} bytes</p>
            <button
              className={styles.delete}
              onClick={() => handleFileRemove(index)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
});

UploadFileDialog.displayName = "uploadFileDialog";

export default UploadFileDialog;
