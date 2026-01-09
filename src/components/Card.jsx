export default function Card(fileFolder){
    return(
        <div>
            {fileFolder.name}
            <p>Modified <span>{fileFolder.updatedAt}</span>.<span>{fileFolder.size}</span></p>
        </div>
    )
}