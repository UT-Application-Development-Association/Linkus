import styles from "./style.module.css";
import { reportComment } from "../../../../api/requets/report";

export default function (prop){
    const comment = prop.comment;

    const onReport = () => {
        console.log(comment);
        reportComment(comment)
            .then(() => alert("Succeed."))
            .catch(() => alert("Failed to report. Please try again."));
    }
    console.log(comment)
    return (
        <div className={styles.container}>
            <img className={styles.avatar} alt="Avatar" src={comment.userSimple?.avatar}/>
            <div className={styles.name}>{comment.userSimple?.username}</div>
            <div className={styles["btn-report"]} onClick={onReport}>
                    report
            </div>
            <div className={styles.content}>
                {comment.comment}
            </div>
        </div>
    )
}
