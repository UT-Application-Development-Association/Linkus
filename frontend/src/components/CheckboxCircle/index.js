import styles from "./style.module.scss";
import {useState} from "react";

export default function (prop){
    const { onChange, defaultValue, defaultChecked } = prop;
    const [checked , setChecked] = useState(defaultChecked === undefined? true : defaultChecked);

    const changeHandler = () => {
        onChange(!checked);
        setChecked(!checked);
    }

    return (
        <input type="checkbox" onChange={() => changeHandler()} defaultValue={defaultValue} defaultChecked={defaultChecked} className={styles["cir-checkbox"]}/>
    )
}
