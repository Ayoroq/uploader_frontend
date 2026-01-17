import styles from './Login.module.css'
import {useState} from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'   

export default function Login(){
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const {login} = useAuth();
    const [userData, setUserData] = useState({
        username: '',
        password: '',
    }) 

    function handleChange(e){
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        const result = await login(userData.username, userData.password);
        if(!result.success){
            setError(result.error);
        }
    }
    return(
        <div className={styles.login}>
            <form className={styles.loginform} onSubmit={handleSubmit}>
                <input  
                    type="text" 
                    id="loginUsername"
                    name="username"
                    placeholder="Username" 
                    value={userData.username}
                    onChange={handleChange}
                    autoFocus 
                    required 
                />
                <input 
                    type="password" 
                    id="loginPassword"
                    name="password"
                    placeholder="Password" 
                    value={userData.password}
                    onChange={handleChange}
                    required 
                    minLength={8} 
                />
                <button type='submit' className={styles.loginbutton}>Login</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            <div>
                <p>Don't have an account? <span className={styles.signupSpan} onClick={() => navigate('/signup')}>Signup</span></p>
            </div>
        </div>
    )
}