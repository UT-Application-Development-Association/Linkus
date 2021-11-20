import styles from "./style.module.css";
import MainPageHeader from "./Header";
import MainPageBody from "./Body";
import Particles from "./particles";
import {useEffect} from "react";

export default function MainPage(){
    useEffect(() => {
        new Particles({color: "#c3c7c6", lineColor: "#4d4b4b"}).run();
    }, []);

    return (
        <div className={styles.container}>
            <canvas id="particles" className={styles.particles}/>
            <MainPageHeader />
            <MainPageBody />
        </div>
    )
}
