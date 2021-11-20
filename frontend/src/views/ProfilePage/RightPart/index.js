/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import styles from "./style.module.css";
import CommentItem from "./CommentItem";
import { Link, useNavigate, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUserInfo } from "../../../hooks/useUserInfo";

export default function (prop) {
    let user = useUserInfo();
    const { uuid } = useParams();
    // const uuiduser = userinfo?.uuid === uuid
    // const [isOwner, setIsOwner] = useState(false);
    const { profile = {} } = prop;
    const navigator = useNavigate();

    const toCommentPage = () => {
        navigator(`/comment/${uuid}`);
    };

    useEffect(() => {
    }, []);

    const getButtonContent = (isOwner) => {
        // if (isOwner === null) {
        //     return (
        //         <div>Loading ...</div>
        //     )
        // }
        // else if (!isOwner) {
        //     return (
        //         <Link to="/profile" className={styles.buttonLink}>
        //             Rate & Comment
        //         </Link>
        //     )
        // } else {
        //     return (
        //         <Link to="/editprofile" className={styles.buttonLink}>
        //             Edit
        //         </Link>
        //     )
        // }
        return <>
            {
                uuid === user._id ?
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonWrapper}>
                            <Link to={`/editprofile/${uuid}`} className={styles.buttonLink}>
                                Edit Profile
                            </Link>
                    </div>
                </div>
                    :
                <div className={styles.buttonContainer}>
                    <div className={styles.buttonWrapper}>
                        <Link to={`/comment/${uuid}`} className={styles.buttonLink}>
                            Rate & Comment
                        </Link>
                    </div>
                </div>

            }
        </>
    }

    return (
        <div className={styles.container}>
            <div className={styles.bioContainer}>
                <div className={styles.title}>Biography</div>
                <div className={styles.content}>
                    {profile?.bio || <div className={styles.emptyMessage}>No bio found</div>}
                </div>
            </div>
            <div className={styles.courseContainer}>
                <div className={styles.title}>Course Taking</div>
                {
                    (Array.isArray(profile?.courses) && profile?.courses.length > 0) ? (
                        <ul>
                            {profile?.courses.map(value => <li key={value} className={styles.content}>{value}</li>)}
                        </ul>
                    ) : (<div className={styles.emptyMessage}>No course taken</div>)
                }
            </div>
            <div className={styles.commentContainer}>
                <div className={styles.title}>Comments</div>
                {
                    (Array.isArray(profile?.comments) && profile?.comments.length > 0) ? (
                        profile?.comments.map(value => <CommentItem key={value} comment={value} />)
                    ) : (<div className={styles.emptyMessage}>No comments posted</div>)
                }
            </div>
            {getButtonContent()}
            {/* {
                uuiduser ?
                    <div className={styles.buttonContainer}>
                        <div className={styles.buttonWrapper}
                        ><Link to="/editprofile" className={styles.buttonLink}>
                                Edit Profile
                            </Link>

                        </div>
                    </div> : ""
            } */}


        </div>
    )
}

