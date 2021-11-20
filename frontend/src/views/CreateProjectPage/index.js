import styles from "./style.module.scss";
import Header from "../../components/Header";
import Button from "../../components/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";
import { createProject } from "../../api/requets/projects";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/accountSlice";
import { checkSession } from "../../api/requets/account";

export default function ProjectPage(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useUserInfo();
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Invalid input.");
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
        courseCode: "",
        department: "",
        capacity: 1,
        deadline: ""
    });
    const showErrorMsg = (msg) => {
        setErrorMsg(msg);
        setShowError(true);
    }

    const submit = async () => {
        setShowError(false);

        // validation
        const data = Object.assign({}, projectData);

        if (data.title === '') {
            showErrorMsg("Title cannot be empty.");
            return;
        }
        if (data.description === '') {
            showErrorMsg("Description cannot be empty.");
            return;
        }
        if (data.courseCode === '') {
            showErrorMsg("Course code cannot be empty.");
            return;
        }
        if (data.department === '') {
            showErrorMsg("Department cannot be empty.");
            return;
        }
        if (data.deadline === '') {
            showErrorMsg("Deadline cannot be empty.");
            return;
        }
        if (data.capacity === -1) {
            showErrorMsg("Capacity cannot be empty.");
            return;
        }
        data.capacity = Number.parseInt(data.capacity);
        if(Number.isNaN(data.capacity)){ 
            showErrorMsg("Capacity must be an integer number.");
            return;
        }

        data.deadline = Date.parse(data.deadline);
        if (isNaN(data.deadline)) {
            showErrorMsg("Deadline must be in format yyyy-mm-dd.");
            return;
        }
        data.deadline = new Date(data.deadline);

        createProject(data)
            .then(() => {
                navigate("/");
                checkSession()
                    .then(user => dispatch(setUser(user)))
                    .catch(e => { });
            })
            .catch(e => {
                showErrorMsg("Internal error in server: " + e);
            })

    }

    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.wrapper}>
                <div className={styles.titleContainer}>
                    <p className={styles.title}>
                        New Project
                    </p>
                </div>
                <hr className={styles.titleLine} />
                <div className={styles.formItem}>
                    <span className={styles.label}>Title</span>
                    <input
                        placeholder={'ex. CSC309'}
                        className={styles.longInput}
                        onChange={e => setProjectData(data => ({...data, title: e.target.value}))}
                    />
                </div>
                <div className={styles.formItem}>
                    <span className={styles.label}>Course Code</span>
                    <input
                        placeholder={'ex. CSC309'}
                        className={styles.input}
                        onChange={e => setProjectData(data => ({...data, courseCode: e.target.value}))}
                    />
                    <span className={styles.label}>Department</span>
                    <input
                        placeholder={"ex. Computer Science"}
                        className={styles.input}
                        onChange={e => setProjectData(data => ({ ...data, department: e.target.value }))}
                    />
                </div>
                <div className={styles.formItem}>
                    <span className={styles.label}>Capacity (group size)</span>
                    <input
                        defaultValue={1}
                        type="number"
                        placeholder={"ex. 6"}
                        className={styles.input}
                        onChange={e => setProjectData(data => ({ ...data, capacity: e.target.value }))}
                    />
                </div>
                <div className={styles.formItem}>
                    <span className={styles.label}>Deadline</span>
                    <input
                        type="date"
                        placeholder={"yyyy-mm-dd"}
                        className={styles.longInput}
                        onChange={e => setProjectData(data => ({ ...data, deadline: e.target.value }))}
                    />
                </div>
                <div className={styles.formItem}>
                    <span className={styles.label} style={{ alignSelf: 'flex-start' }}>Description</span>
                    <textarea
                        placeholder={"Describe your project here ..."}
                        className={styles.longInput}
                        onChange={e => setProjectData(data => ({ ...data, description: e.target.value }))}
                    />
                </div>
                {showError ?
                    <div className={styles["error"]}>
                        {errorMsg}
                    </div>
                    : <div />}
                <div className={styles.buttonWrapper}>
                    <Button
                        className={styles.sendButton}
                        onClick={() => submit()}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )


}
