import styles from "./style.module.scss";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById as apiGetUser, postComment } from "../../api/requets/account";

export default function (){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { uuid } = useParams();
    const [commentContent, setCommentContent] = useState("");

    const addComment = async () => {
        if (commentContent === "") {
            alert("Empty comment is not allowed.");
            return;
        }
        postComment(uuid, commentContent)
            .then(user => setUser(user))
            .finally(() => navigate(-1))
            .catch(e => {
                console.log(e);
                alert("Failed to post comment due to server issue.");
            });
    };

    useEffect(() => {
        setLoading(true);
        apiGetUser(uuid)
            .then(user => setUser(user))
            .finally(() => setLoading(false))
            .catch(e => {
                console.log(e);
                navigate(-1);
            });
    }, []);

    return (
        <div className={styles["page-container"]}>
            <Header />
            {loading?
                (<div>Loading</div>) :
                (<div className={styles["body-container"]}>
                    <div className={styles["body-wrapper"]}>
                        <button onClick={() => navigate(-2)}
                                className={styles["btn-back"]} />
                        <div className={styles["form-wrapper"]}>
                            <div className={styles["layer-1-wrapper"]}>
                                <img className={styles["avatar"]} src={user.profile.avatar} alt="avatar"/>
                                <div className={styles["name"]}>
                                    {user.profile.username}
                                </div>
                            </div>
                            {/* <div className={styles["layer-2-wrapper"]}>
                                <div className={styles["wrapper"]}>
                                    <div className={styles["title"]}>Number of stars(out of 5)</div>
                                    <input className={styles["input"]} placeholder="ex.5"/>
                                </div>
                            </div> */}
                            <div className={styles["layer-3-wrapper"]}>
                                <div className={styles["wrapper"]}>
                                    <div>Comment</div>
                                    <textarea className={styles["input"]} placeholder="Please leave any comments here..." onChange={e => setCommentContent(e.target.value)}/>
                                </div>
                            </div>
                            <div className={styles["button-wrapper"]} onClick={() => addComment()}>
                                <div className={styles["button"]}>
                                    Submit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}
