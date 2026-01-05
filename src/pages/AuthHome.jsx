import styles from "./AuthHome.module.css";
import { useRef, useState } from "react";
export default function AuthHome() {
  const fileInput = useRef(null);
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    e.target.value = null;
  }

  function handleFileRemove(index){
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  return (
    <main className={styles.authhome}>
      <section>
        <button
          className={styles.upload}
          aria-label="Upload files"
          onClick={() => fileInput.current.click()}
        >
          Files Upload
        </button>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          ref={fileInput}
          className={styles.fileInput}
          multiple
          onChange={handleFileChange}
        />
      </section>
      <section>
        <ul>
          {files.map((file, index) => (
            <li key={`${index}-${file.name}`}>
              <p>{file.name}</p>
              <p>{file.size} bytes</p>
              <button className={styles.delete} onClick={() => handleFileRemove(index)}>x</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}