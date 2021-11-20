import styles from "./style.module.scss";
import {useState} from "react";
import classNames from "classnames";

export default function (prop){
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const { title, onChange, dataList, cssClass} = prop;

    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (item) => {
        toggleList();
        setSelected(item);
        onChange(item);
    }

    return (
        <div className={styles["dd-wrapper"]}>
            <button type="button"
                    className={`${styles["dd-header"]}`}
                    onClick={() => toggleList()}>
                <div className={styles["dd-header-wrapper"]}>
                    <div className={styles["dd-header-title"]}>{ selected === null? title:selected }</div>
                    <div className={styles["dd-header-arrow"]}>
                        <div className={`${styles["arrow"]} ${isOpen? styles["up"] : styles["down"]}`} />
                    </div>
                </div>
            </button>
            {isOpen && (
                <div role="list" className={styles["dd-body"]}>
                    {dataList.map(item => (
                        <button type="button"
                                className={`${styles["dd-item"]} ${item === selected? styles["selected"] : ''}`} key={item}
                                onClick={() => handleSelect(item)}>
                            { item }
                        </button>
                        ))}
                </div>
            )}
        </div>
    )
}
