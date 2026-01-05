import styles from './AuthHome.module.css'
import {useRef} from 'react'
export default function AuthHome() {
    const fileInput = useRef(null)
    return (
        <main className={styles.authhome}>
            <section>
                <button className={styles.upload} onClick={() => fileInput.current.click()}>Files Upload</button>
                <input type="file" id='fileInput' name='fileInput' ref={fileInput} className={styles.fileInput} />
            </section>
            <section>
            </section>
        </main>
    )
}   