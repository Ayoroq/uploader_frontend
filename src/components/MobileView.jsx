import styles from './MobileView.module.css'
import Card from './Card.jsx'
export default function MobileView({filesFolders, className}){
    return (
        <main className={`${styles.mobileView} ${className || ''}`}>
            <div className={styles.cards}>
                {filesFolders.map((fileFolder, index) => {
                    return <Card key={index} fileFolder={fileFolder} />
                })}
            </div>
        </main>
    )
}