import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import FilterBar from "./FilterBar";
import ResultSection from "./ResultSection";
import styles from "./style.module.scss";
import { searchForProjects } from "../../api/requets/projects";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function () {
    let navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let searchContent = searchParams.get("content");
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setLoading(true);
        searchForProjects(searchContent)
            .then(value => setProjects(value))
            .finally(() => setLoading(false))
            .catch(e => {
                alert("Network error. Please try again.");
                console.log(e);
                navigate(-1);
            })
    }, [searchContent]);
    

    const applyFilterHandler = async (filterInfo) => {
        setLoading(true);
        searchForProjects(searchContent, filterInfo)
            .then(value => setProjects(value))
            .finally(() => setLoading(false))
            .catch(e => {
                alert("Network error. Please try again.");
                console.log(e);
                navigate(-1);
            });
    }

    return (
        <div className={styles["search-container"]}>
            <div className={styles["header-container"]}>
                <Header />
            </div>
            <div className={styles["body-container"]}>
                <div className={styles["filter-container"]}>
                    <FilterBar loading={loading} eventHandler={applyFilterHandler} />
                </div>
                <div className={styles["results-container"]}>
                    <ResultSection loading={loading} projects={ projects } />
                </div>
            </div>
        </div>
    )
}
