import styles from "./style.module.css";

const ProfileScreen = (prop) => {
    const { profile = {} } = prop;
    return (
        <div className={styles.container}>
            <img className={styles.avatar} alt="avatar" src={profile?.avatar} />
            <div className={styles.slot}>
                <div className={styles.title}>Name</div>
                <div className={styles.content}>{profile?.username}</div>
            </div>
            <div className={styles.slot}>
                <div className={styles.title}>Year of Study</div>
                <div className={styles.content}>{profile?.yearOfStudy || 'none'}</div>
            </div>
            <div className={styles.slot}>
                <div className={styles.title}>Program of Study</div>
                <div className={styles.content}>{profile?.program || 'none'}</div>
            </div>
            <div className={styles.slot}>
                <div className={styles.title}>Expected CGPA</div>
                <div className={styles.content}>{profile?.exGPA || 'none'}</div>
            </div>

        </div>
    )
}

export default ProfileScreen