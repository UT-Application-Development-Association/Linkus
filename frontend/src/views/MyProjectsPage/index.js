import styles from "./style.module.scss";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";

export default function MyProjectsPage(){

    const user = useUserInfo();
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Header/>
            {
                user === null ? <div>Please wait ...</div> :
                <div className={styles.wrapper}>
                    <div className={styles.titleContainer}>
                        <p className={styles.title}>
                            My Projects
                        </p>
                    </div>
                    <div className={styles.bodyWrapper}>
                        {user.myProjects.map((project) => 
                            (
                                <div className={styles.projectWrapper} key={project.projectId}>
                                    <div className={styles["info-section"]}>
                                        <img src={project.owner.avatar} onClick={ () => {navigate(`/profile/${project.ownerId}`)}} />
                                        {project.owner.username}
                                    </div>
                                    <div className={styles["info-section"]}>
                                        {project.title}
                                    </div>
                                    <div className={styles["info-section"]}>
                                        {project.description}
                                        {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
                                    </div>
                                    <div className={styles["info-section"]}>
                                        {`DDL: ${new Date(project.deadline).toISOString().slice(0, 10)}`}
                                    </div>
                                    <button onClick={() => navigate(`/project/${project.projectId}`)} className={styles["btn-back"]}/>
                                </div>
                            )
                        )}
                    </div>
                </div>
            }
        </div>
    )
}
