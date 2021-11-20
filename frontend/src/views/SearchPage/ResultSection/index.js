import styles from "./style.module.scss";
import ResultItem from "./ResultItem";
import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { useSearchParams } from "react-router-dom";


export default function (props) {
    const projects = props.projects;
    const loading = props.loading;

    return (
        <div>
            {loading
                ? (<div> Loading </div>)
                : (<div className={styles["result-section-container"]}>
                    {projects.map(project => (<ResultItem post={project} key={uuid()}/>))}
                    <div> No more </div>
                </div>)}
        </div>
    )
}
