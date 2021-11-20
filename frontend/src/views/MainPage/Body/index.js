import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

export default function(){
    const navigate = useNavigate();
    const [content, setContent] = useState("");

    const searchFor = (e) => {
        if(e.key === "Enter"){
            // use this to encode special characters.
            const param = new URLSearchParams({content: content});
            navigate("/search?" + param.toString());
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.centerWrapper}>
                <div className={styles.text}>
                    LinkUs
                </div>
                <div className={styles.searchWrapper}>
                    <div className={styles.leftBar} />
                    <div className={styles.inputWrapper}>
                        <input onChange={(e) => setContent(e.target.value)}
                               onKeyPress={(e) => searchFor(e)}
                               className={styles.input}
                               placeholder="Search Course (ex. CSC108)"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
