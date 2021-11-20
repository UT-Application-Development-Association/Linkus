import styles from "./style.module.scss";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getTaskByUuid, deleteTaskByUuid, postComment } from "../../api/requets/task";
import {useNavigate, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan, faEdit} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { reportComment } from "../../api/requets/report";


export default function (){
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [commentText, setCommentText] = useState('');
    const { uuid } = useParams();
    const user = useSelector(state => state.accountReducer.user);

    useEffect(() => {
        setIsLoading(true);
        getTaskByUuid(uuid)
            .then(task => setTask(task))
            .finally(() => setIsLoading(false))
            .catch(e => {
                console.log(e);
                alert("Task not exist.");
                navigate(-1);
            });
    }, [])

    const onReport = (comment) => {
        alert('report');
        reportComment({ comment: comment })
            .then(() => alert("Reported!"))
            .catch(e => {
                alert("Please try again.")
            });
        
    }
    const deleteTask = async () => {
        deleteTaskByUuid(uuid)
            .then(() => navigate(-1))
            .catch(e => {
                alert("Cannot delete task, you have no permission.");
            })
    }

    const addComment = async () => {
        if (commentText === '') return;
        postComment(uuid, {comment: commentText})
            .then(task => setTask(task))
            .finally(() => setCommentText(''))
            .catch(e => { 
                console.log(e);
                alert("Cannot add comment, please try again.");
            })
    }

    return (
     <div className={styles["task-page-container"]}>
         <div className={styles["header-container"]}>
             <Header />
         </div>
         <div className={styles["body-container"]}>
             {loading? (<div> Loading </div>)
                 : (<div className={styles["body_wrapper"]}>
                     <div className={styles["info_section"]}>
                         <div className={styles["left"]}>
                             <div className={styles["row-1"]}>
                                <button onClick={() => navigate(-1)} className={styles["btn-back"]}/>
                                {/* <div className={styles["btn-action"]} onClick={() =>  }>
                                     <FontAwesomeIcon icon={faEdit} />
                                </div> */}
                                <div className={styles["btn-action"]} onClick={() => deleteTask() }> 
                                     <FontAwesomeIcon icon={faTrashCan} />
                                </div>
                             </div>
                             <div className={styles["title"]}>
                                 { task.title }
                             </div>
                             <div className={styles["detail"]}>
                                 { task.description }
                             </div>
                         </div>
                         <div className={styles["right"]}>
                            <div className={styles["info-wrapper"]}>
                                <div className={styles["row-item"]}>
                                    <div className={styles["left-part"]}>Project</div>
                                    <div className={styles["right-part"]}>{ task.projectSimple.name }</div>
                                </div>
                                <div className={styles["row-item"]}>
                                    <div className={styles["left-part"]}>Assignee</div>
                                    <div className={styles["right-part"]}>{ task.assigneeSimple.username }</div>
                                </div>
                                {/* <div className={styles["row-item"]}>
                                    <div className={styles["left-part"]}>Priority</div>
                                    <div className={styles["right-part"]}>{ task.priority }</div>
                                </div> */}
                                <div className={styles["row-item"]}>
                                    <div className={styles["left-part"]}>Due date</div>
                                    <div className={styles["right-part"]}>{ new Date(task.dueDate).toISOString().slice(0, 10) }</div>
                                </div>
                            </div>
                         </div>
                     </div>
                     <div className={styles["comment-section"]}>
                         <div className={styles["timeline-wrapper"]}>
                             {task.comments.map(comment => (
                                 <div className={styles["timeline-item"]}>
                                     <div className={styles["timeline-item-row-1"]}>
                                         <img className={styles["avatar"]} src={comment.userSimple.avatar} alt="avatar"/>
                                         <div className={styles["name"]}>{ comment.userSimple.username }</div>
                                         <div className={styles["btn-report"]} onClick={() => onReport(comment)}>
                                                report
                                          </div>
                                     </div>
                                     <div className={styles["timeline-item-row-2"]}>
                                         <div className={styles["msg-wrapper"]}>
                                             { comment.comment }
                                         </div>
                                     </div>
                                 </div>
                             ))}
                             <div className={styles["end"]}> END </div>
                         </div>
                         <div className={styles["input-wrapper"]}>
                             <textarea className={styles["input"]} value={commentText} placeholder="Write a comment here." onChange={e => setCommentText(e.target.value)}/>
                         </div>
                            <div className={styles["btn-add"]} onClick={() => addComment()}>
                             Add comment
                         </div>
                     </div>
                 </div>)}
         </div>
     </div>
    )
}
