import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";

export default function (prop){
    const { post } = prop;
    const navigate = useNavigate();

    const toPostPage = () => {
        navigate(`/post/${post._id}`);
    };

    const toProfilePage = () => {
        navigate(`/profile/${post.owner}`);
    };

    return (
        <div className={styles["result-item-container"]}>
            <div className={styles["result-item-row-1"]}>
                <img className={styles["avatar"]}
                     src={post.ownerSimple.avatar}
                     alt="avatar"
                     onClick={() => toProfilePage()}/>
                <div className={styles["name"]}>{ post.ownerSimple.username }</div>
                {/* <div className={styles["year"]}>{ `•Year ${post.year}` }</div> */}
                <div className={styles["time-status-wrapper"]}>
                    <div className={styles["time-status"]}>{ new Date(post.creationDate).toISOString().slice(0, 10) }</div>
                </div>
            </div>
            <div className={styles["result-item-row-2"]}
                 onClick={() => toPostPage()}>
                <div className={styles["title"]}>{ post.title }</div>
            </div>
            <div className={styles["result-item-row-3"]}
                 onClick={() => toPostPage()}>
                <div className={styles["description"]}>{ post.description }</div>
            </div>
            <div className={styles["result-item-row-4"]}>
                <div className={styles["tag-wrapper"]}>
                    <div className={styles["content"]}>{`${post.members.length} / ${post.capacity} members`}</div>
                </div>
                <div className={styles["tag-wrapper"]}>
                    <div className={styles["content"]}>{post.courseCode}</div>
                </div>
                <div className={styles["tag-wrapper"]}>
                    <div className={styles["content"]}>{post.department}</div>
                </div>
                <div className={styles["tag-wrapper"]}>
                    <div className={styles["content"]}>{`Due in ${parseInt(Math.abs(new Date(post.deadline).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000), 10)} days`}</div>
                </div>
                {/* { post.tags.map(tag => (
                    <div className={styles["tag-wrapper"]}>
                        <div className={styles["content"]} key={ tag }>{ tag }</div>
                    </div>
                ))} */}
            </div>
            <div className={styles["result-item-divider"]} />
        </div>
    )
}
