import styles from "./style.module.css";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/accountSlice";
import { useEffect, useState } from "react";
import { getProjectDetail } from "../../api/requets/projects";
import { uploadNewTask } from "../../api/requets/task";
import { checkSession } from "../../api/requets/account";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


const CreateTaskPage = () => {

    // const { project } = prop;
    const { uuid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState({
        title: "",
        description: "",
        dueDate: new Date().toString(),
        assigneeId: "",
        projectId: uuid
    });

    // eslint-disable-next-line no-restricted-globals
    const goBack = () => navigate(-1);

    const createTask = () => {
        const temp = Object.assign({}, values);
        if (temp.assigneeId === "") temp.assigneeId = project.memberSimple[0].memberId;
        console.log(temp);
        uploadNewTask(temp)
            .then(() => {
                alert("Succeed.");
                checkSession()
                    .then(user => dispatch(setUser(user)))
                    .catch(e => { });
                navigate(`/project/${uuid}`);
            }).catch(e => {
                alert("Cannot upload new task. Please try again.");
            })
        
    };

    useEffect(() => {
        if (uuid) {
            setLoading(true);
            console.log(loading);
            getProjectDetail(uuid)
                .then(p => {
                    console.log(p);
                    setProject(p);
                    console.log(project);
                })
                .finally(() => setLoading(false))
                .catch(e => {
                    alert("Failed to load project. Please try again.");
                    navigate(-1);
            }) 
        }
    }, []);

    console.log(project);

    return (
        <div className={styles.container}>
            <Header />
            {loading ? <div>Loading ... </div> :
                <div><div className={styles.bodyWrapper}>
                <div className={styles.backBtnWrapper}>
                    <button className={styles.backBtn} onClick={goBack}/>
                </div>
                <div className={styles.form}>
                    <div className={styles.title}>
                        <p>
                            Title
                        </p>
                        <input
                            placeholder={'ex. finish login page'}
                            className={styles.titleInput}
                            name={"title"}
                            value={values.title}
                            onChange={e => setValues(v => ({...v, title: e.target.value}))}
                        />
                    </div>
                    <div className={styles.dropDownWrapper}>
                        <FormControl>
                            <InputLabel>Assignee</InputLabel>
                            <Select
                                className={styles.dropDown}
                                value={project.memberSimple[0].memberId}
                                label="Assignee"
                                onChange={e => {
                                    setValues(v => ({ ...v, assigneeId: e.target.value }));
                                    console.log(e.target.value);
                                }}
                            >
                                {project.memberSimple.map((mem) => {
                                    return (<MenuItem
                                        value={mem.memberId}
                                        key={mem.memberId}
                                    >{mem.username}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.ddlWrapper}>
                        Due Date
                        <input
                            type="date"
                            name={"dueDate"}
                            placeholder={"yyyy-mm-dd"}
                            className={styles.longInput}
                            onChange={e => setValues(v => ({...v, dueDate: e.target.value}))}
                        />
                    </div>
                    <div className={styles.descriptionWrapper}>
                        Description
                        <textarea
                            name={"description"}
                            value={values.description}
                            onChange={e => setValues(v => ({...v, description: e.target.value}))}
                            placeholder={"Please Enter Request Information"}
                            className={styles.description}
                        />
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button
                            className={styles.sendButton}
                            onClick={createTask}>
                            <p>Create Task</p>
                        </Button>
                    </div>
                </div>
            </div></div>
            }
        </div>
    )
}

export default CreateTaskPage;