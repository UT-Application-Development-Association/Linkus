import styles from "./style.module.scss";
import CheckboxCircle from "../../../components/CheckboxCircle";
import Dropdown from "./Dropdown";
import {useEffect, useState} from "react";


export default function (props) {
    const [filterInfo, setFilterInfo] = useState({
        notFull: null,
        department: null,
        deadline: null,
        groupSize: null
    })
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Invalid input.");
    const loading = props.loading;
    const eventHandler = props.eventHandler;

    const showErrorMsg = (msg) => {
        setErrorMsg(msg);
        setShowError(true);
    }

    const submit = (msg) => {
        setShowError(false);
        const info = Object.assign({}, filterInfo);
        // validate fields
        if (info.department === '') info.department = null;
        if (info.groupSize === '') info.groupSize = null;
        if (info.deadline === '') info.deadline = null;

        try { 
            info.groupSize = Number.parseInt(info.groupSize);
        } catch (e) {
            showErrorMsg("Invalid Group Size.");
            return;
        }

        try { 
            info.deadline = new Date(info.deadline);
        } catch (e) {
            showErrorMsg("Invalid deadline time. Use yyyy-mm-dd.");
            return;
        }
        eventHandler(info);
        setFilterInfo({
            notFull: null,
            department: null,
            deadline: null,
            groupSize: null
        });

    }

    return (
        <div>
            {loading
                ? (<div> Loading </div>)
                : (<div className={styles["filter-container"]}>
                    <div className={styles["title"]}> Filters </div>
                    <div className={styles["not-full-checkbox-container"]}>
                        <CheckboxCircle defaultChecked={false} onChange={(checked) => setFilterInfo(info => ({...info, notFull: checked}))}/>
                        <div className={styles["description"]}>Teams Not Full</div>
                    </div>
                    <div className={styles["input-container"]}>
                        <input className={styles["input"]} placeholder="Group size" onChange={e => setFilterInfo(info => ({...info, groupSize: e.target.value}))} />
                    </div>
                    <div className={styles["input-container"]}>
                        <input className={styles["input"]} placeholder="Deadline" onChange={e => setFilterInfo(info => ({...info, deadline: e.target.value}))}/>
                    </div>
                    <div className={styles["input-container"]}>
                        <input className={styles["input"]} placeholder="Department" onChange={e => setFilterInfo(info => ({...info, department: e.target.value}))}/>
                        {/* <Dropdown title="Major" dataList={majors} onChange={(item) => setMajor(item)}/> */}
                    </div>
                    {showError ?
                        <div className={styles["error-msg-container"]}>
                            <div className={styles["error-msg"]}>{ errorMsg }</div>
                        </div>
                        : <div />
                    }
                    <div className={styles["submit-btn-container"]} onClick={() => submit()}>
                        <div className={styles["submit-btn"]}>Comfirm</div>
                    </div>
                </div>)}
        </div>
    )
}
