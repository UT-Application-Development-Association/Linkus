import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../../components/Permission";
import Layout from "../../../components/Layout";
import {
  getProjectDetail as apiGetProjectDetail,
  deleteProject as apiDeleteProject,
} from "../../../api/requets/projects";
import Button from "../../../components/Button";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserInfo } from "../../../hooks/useUserInfo";

const TaskCard = (props) => {
  const { title, description, userSimple, comments } = props
  return (
    <div className={styles.taskCard}>
      <h2>{title}</h2>
      <div>{description}</div>
    </div>
  )
}

const ProjectDetailManageScreen = () => {
  const user = useUserInfo()
  const navigate = useNavigate();
  const { id: projId } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && projId) {
      setLoading(true);
      apiGetProjectDetail(projId)
        .then((detail) => setProjectDetail(detail))
        .catch(() => alert('Failed to get detail'))
        .finally(() => setLoading(false));
    }
  }, [user, projId]);

  const deleteProject = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      apiDeleteProject(projId)
      .then(() => {
        alert("Deleted!");
        // eslint-disable-next-line no-restricted-globals
        history.back();
      }).catch(() => alert('Failed to delete'));
      // eslint-disable-next-line no-restricted-globals
      // history.back();
    }
  };

  const addTask = () => {
    navigate(`/createTask`);
  };

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        {loading ? (
          <h2 className={styles.loading}>Please wait...</h2>
        ) : projectDetail ? (
          <div className={styles.detailScren}>
            <div className={styles.title}>
              <h1>{projectDetail.title}</h1>
              <Button
                size="larger"
                type="danger"
                onClick={() => deleteProject()}
              >
                Delete Project
              </Button>
            </div>
            <section>
              <h2>Description</h2>
              <p>Deadline: {projectDetail.deadline}</p>
              <p>Description: {projectDetail.description}</p>
              <p>Task to do: {projectDetail.todo}</p>
            </section>

            <section>
              <h2>
                Member:{" "}
                <span className={styles.tag}>
                  {projectDetail.members.length}/{projectDetail.capacity}
                </span>
              </h2>
              {projectDetail.memberSimple.map((m) => {
                return (
                  <span key={m.username} className={styles.tag}>
                    {m.username}
                  </span>
              )})}
            </section>

            <section>
              <h2 style={{ display: "flex" }}>
                Task:
              </h2>
              <div className={styles.taskListWrapper}>
                <div className={styles.taskList}>
                  <h4>Backlog: </h4>
                  {
                    projectDetail.planTask && projectDetail.planTask.map(TaskCard)
                  }
                </div>
                <div className={styles.taskList}>
                  <h4>Developing: </h4>
                  {
                    projectDetail.developTask && projectDetail.developTask.map(TaskCard)
                  }
                </div>
                <div className={styles.taskList}>
                  <h4>Finished: </h4>
                  {
                    projectDetail.finishedTask && projectDetail.finishedTask.map(TaskCard)
                  }
                </div>
              </div>
              
            </section>
          </div>
        ) : (
          <div />
        )}
      </Permission>
    </Layout>
  );
};

export default ProjectDetailManageScreen;
