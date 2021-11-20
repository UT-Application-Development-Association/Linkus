import styles from "./style.module.css";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { addRequest, getProjectDetail } from "../../api/requets/projects";
import { useEffect, useState } from "react";
import {useUserInfo} from "../../hooks/useUserInfo";


export default function RequestPage(){
    const [requestInfo, setRequestInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const { uuid } = useParams();
    const [postDetail, setPostDetail] = useState(null);

    useEffect(() => {
        setLoading(true);
        getProjectDetail(uuid)
            .then(p => {
                setPostDetail(p);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch(e => {
                alert("Failed to load project, please try again.");
                navigate(-1);
            });
    }, [])

    const handleInfoChange = (event) => {
        setRequestInfo(event.target.value);
    };

    const navigate = useNavigate();

    const postRequest = () => {
        addRequest(requestInfo, uuid)
            .then(() => alert("Succeed. Please wait for project owner's response."))
            .finally(() => navigate(-1))
            .catch(e => {
                alert("Cannot send request, please try again.");
            })
    };

    return (
        <div className={styles.container}>
            <Header />
            {loading ? <div>loading ...</div> :
                <div>
                    <div className={styles.bodyWrapper}>
                        <div className={styles.title}>
                            <img className={styles.avatar} alt="avatar"
                                src={postDetail.ownerSimple.avatar}/>
                            <p className={styles.titleText}>{"Request to join " + postDetail.ownerSimple.username + "\'s " + postDetail.title + "team"}</p>
                        </div>
                        <p className={styles.prompt}>Request Body</p>
                        <textarea
                            value={requestInfo}
                            onChange={handleInfoChange}
                            placeholder={"Please Enter Request Information"}
                            className={styles.inputBody}
                        />
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button className={styles.sendButton}
                                onClick={postRequest}
                        >
                            <p>Send Request</p>
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}
