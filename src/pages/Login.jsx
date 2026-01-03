import styles from './Login.module.css'
export default function Login(){
    return(
        <div className={styles.login}>
            <form className={styles.loginform}>
                <input  type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button className={styles.loginbutton}>Login</button>
            </form>
        </div>
    )
}