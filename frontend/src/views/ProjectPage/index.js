import styles from "./style.module.scss";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function ProjectPage(){
    const navigate = useNavigate();

    const toAddTask = () => {
        navigate(`/createTask`);
    };

    const demo = {
        maxMemberNum: "5",
        title : "CSC 369 A2",
        year : "2022",
        month : "02",
        day : "23",
        description : "Utilize user level threads to achieve concurrency." +
            "Task to do: Preemptive Threading, Sleep and Wakeup, Waiting for threads to exit",
        members:[
            "David",
            "Gareth"
        ],
        tasks:
        [
            {
                title: "Finish Project Design",
                description: "Finish the Project Design. " +
                    "Put relevant information onto youtrack to get started",
                assignee: "Michael"
            },
            {
                title: "Finish login page",
                description: "Finish the centering the login button. " +
                    "Check information with database and allow the enter upon correct input",
                assignee: "Gareth"
            },
            {
                title: "Finish signup page",
                description: "Finish the centering the signup button. " +
                    "Hook up the signup with backend and updating the database.",
                assignee: "David"
            },
            ]
    }

    return(
        <div className={styles.container}>
            <Header/>
            <div className={styles.titleContainer}>
                <header className={styles.title}>
                    {demo.title}
                </header>
            </div>
            <div className={styles.descriptionWrapper}>
                Description
                <p className={styles.description}>
                    Deadline: {demo.month}.{demo.day}, {demo.year} <br/>
                    Description: {demo.description}
                </p>
            </div>
            <div className={styles.memberWrapper}>
                <div className={styles.memberHeader}>
                    Member
                    <div className={styles.memberTag}>
                        <p className={styles.memberCounter}>
                            {demo.members.length}/{demo.maxMemberNum}
                        </p>
                    </div>
                </div>
                <div className={styles.memberBody}>
                    {demo.members.map((member) => {
                        return (
                        <div className={styles.memberBody} key={member}>
                            <div className={styles.member}>
                                {member}
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.taskWrapper}>
                <div className={styles.taskHeader}>
                    <div className={styles.taskTitle}>
                        Tasks
                    </div>
                    <div className={styles.buttonWrapper}>
                        <p className={styles.addTask}
                            onClick={toAddTask}
                        >Add Task</p>

                    </div>
                </div>
                <div className={styles.tasks}>
                    {demo.tasks.map((task) => {
                        return (
                            <div className={styles.taskCard} key={task.title}>
                                {task.title}
                                <div className={styles.taskBodyWrapper}>
                                    <p className={styles.taskDescription}>
                                        Description: <br/>{task.description}
                                    </p>
                                    <div className={styles.taskAssignee}>
                                        {task.assignee}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}