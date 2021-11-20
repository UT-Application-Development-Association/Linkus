import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../components/Permission";
import Layout from "../../components/Layout";
import {
  getAllProjects as apiGetAllProjects,
  deleteProject as apiDeleteProject
} from "../../api/requets/projects";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";

const ProjectListScreen = () => {
  const [projList, setProjList] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserInfo()

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiGetAllProjects()
        .then((list) => setProjList(list))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const deleteAccount = (projId, idx) => {
    if (window.confirm("Are you sure you want to delete?")) {
      apiDeleteProject(projId)
        .then(() => {
          const newList = [...projList];
          newList.splice(idx, 1);
          setProjList(newList);
        })
        .catch((e) => alert('Failed to delete'))
    }
  };

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        <div className={styles.listPage}>
          <h1 className={styles.title}>All Project</h1>

          {loading ? (
            <h2>Please wait...</h2>
          ) : (
            <div className={styles.accountList}>
              {projList.map((proj, idx) => (
                <div className={styles.listItem} key={idx}>
                  <div>
                    <h3 className={styles.name}>{proj.title}</h3>
                    <p>{proj.description}</p>
                  </div>
                  <div className={styles.actionBtn}>
                    <Button type="primary">
                      <Link to={`/project-manage/${proj._id}`}>View</Link>
                    </Button>
                    <Button type="danger" onClick={() => deleteAccount(proj._id,idx)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Permission>
    </Layout>
  );
};

export default ProjectListScreen;
