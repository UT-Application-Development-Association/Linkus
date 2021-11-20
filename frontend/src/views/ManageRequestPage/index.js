import styles from "./style.module.css";
import Header from "../../components/Header";
import Button from "../../components/Button";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectDetail, rejectProjectRequest, acceptProjectRequest } from '../../api/requets/projects'
import { useUserInfo } from "../../hooks/useUserInfo";
import { useQuery } from "../../hooks/useQuery";

export default function ManageRequestPage(){
    const navigate = useNavigate();
    const [reqList, setReqList] = useState(null)
    const user = useUserInfo()
    const { projId } = useParams()
    const { projName } = useQuery() || {}
    const [loading, setLoading] = useState(false);

    const requestState =  {
        UNDECIDED: 0,
        REJECTED: 1,
        ACCEPTED: 2
    }

    const assignment = "CSC369 A2"


    useEffect(() => {
        if (user && projId) {
            setLoading(true);
            getProjectDetail(projId)
            .then((detail) => {
                setReqList(detail.requests)
            })
        }
    }, [user, projId])

    const accept = (requesterId) => {
        acceptProjectRequest(projId, requesterId)
        .then(() => navigate(-1))
        .catch(() => alert('Failed'))
    }

    const reject = (requesterId) => {
        rejectProjectRequest(projId, requesterId)
        .then(() => navigate(-1))
        .catch(() => alert('Failed'))
    }

    console.log(reqList);
    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.bodyWrapper}>
                <div className={styles.titleWrapper}>
                    <header className={styles.title}>
                        {projName} Requests
                    </header>
                </div>
                {
                    (!reqList || reqList.length === 0) && <h2 style={{ textAlign: 'center' }}>No request</h2>
                }
                {reqList && reqList.map((request) => {
                    return (
                        <div className={styles.requestWrapper} key={request.name}>
                            <div className={styles.requestHeader}>
                                <img src={request.user.avatar} alt="avatar" className={styles.avatar}/>
                                <div className={styles.nameWrapper}>
                                    <p className={styles.username}>
                                        {request.user.username}
                                    </p>
                                </div>
                                <div className={styles.yearWrapper}>
                                    <p className={styles.year}>
                                        • Year {request.user.yearOfStudy}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.requestBody}>
                                <div className={styles.requestInfoWrapper}>
                                    <p className={styles.requestInfo}>
                                        {request.info}
                                    </p>
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        onClick={() => accept(request.userId)
                                            // request.requestState = requestState.ACCEPTED
                                        }
                                    >
                                        <p>Accept</p>
                                    </Button>
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <Button
                                        className={styles.rejectButton}
                                        onClick={() => reject(request.userId)
                                            // request.requestState = requestState.REJECTED
                                        }
                                    >
                                        <p>Reject</p>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )


}