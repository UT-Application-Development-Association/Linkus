import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../components/Permission";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";

const ProjectListScreen = () => {
  const user = useUserInfo()

  if (!user) {
    return <Layout><h1 style={{ textAlign: 'center' }}>Please login</h1></Layout>
  }

  const { myProjects } = user
  const deleteProject = () => {

  }

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        <div className={styles.listPage}>
          <h1 className={styles.title}>All Project</h1>

            <div className={styles.accountList}>
              {myProjects.map((proj, idx) => (
                <div className={styles.listItem} key={idx}>
                  <div>
                    <h3 className={styles.name}>{proj.title}</h3>
                    <p>{proj.desc}</p>
                  </div>
                  <div className={styles.requestButton}>
                    <Button type="primary">
                      <Link to={`/manageRequest/${proj.projectId}?projName=${proj.title}`}>Manage Requests</Link>
                    </Button>
                  </div>
                  <div className={styles.actionBtn}>
                    <Button type="primary">
                      <Link to={`/project/${proj.projectId}`}>View</Link>
                    </Button>
                    <Button type="danger" onClick={() => deleteProject(idx)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </Permission>
    </Layout>
  );
};

export default ProjectListScreen;
