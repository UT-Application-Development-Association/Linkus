import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Layout from "../../../components/Layout";
import {
  getProjectDetail as apiGetProjectDetail,
  deleteProject as apiDeleteProject,
  moveTask as apiMoveTask,
} from "../../../api/requets/projects";
import DragList from "../../../components/Drag";
import Button from "../../../components/Button";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserInfo } from "../../../hooks/useUserInfo";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/accountSlice";
import { checkSession } from "../../../api/requets/account";

const taskStatus = {
  planning: 0,
  developing: 1,
  finished: 2,
};

const ProjectDetailManageScreen = () => {
  const user = useUserInfo();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: projId } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && projId) {
      setLoading(true);
      apiGetProjectDetail(projId)
        .then((detail) => setProjectDetail(detail))
        .finally(() => setLoading(false));
    }
  }, [projId, user]);

  if (!user) {
    return (
      <Layout>
        <h1 style={{ textAlign: "center" }}>Please login</h1>
      </Layout>
    );
  }

  const deleteProject = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      apiDeleteProject(projId)
        .finally(() => {
          checkSession()
            .then((user) => dispatch(setUser(user)))
            .catch((e) => {});
          alert("Deleted!");
          // eslint-disable-next-line no-restricted-globals
          navigate(-1);
        })
        .catch((e) => {
          alert("Cannot delete project, please try again.");
        });
    }
  };

  const addTask = () => {
    navigate(`/createTask/${projId}`);
  };

  const moveTask = (taskId, previous, target) => {
    apiMoveTask(projId, taskId, previous, target)
      .then(() => {})
      .catch(() => alert("Failed to move"));
  };

  return (
    <Layout>
      {loading ? (
        <h2 className={styles.loading}>Please wait...</h2>
      ) : projectDetail ? (
        <div className={styles.detailScren}>
          <div className={styles.title}>
            <h1>{projectDetail.title}</h1>
            {user._id === projectDetail.owner ? (
              <div className={styles["btn-wrapper"]}>
                <Button
                  size="larger"
                  type="primary"
                  onClick={() =>
                    navigate(`/manageRequest/${projectDetail._id}`)
                  }
                >
                  Manage Requests
                </Button>
                <Button
                  size="larger"
                  type="danger"
                  onClick={() => deleteProject()}
                >
                  Delete Project
                </Button>
              </div>
            ) : (
              <div />
            )}
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
            {projectDetail.memberSimple &&
              projectDetail.memberSimple.map((m) => {
                return (
                  <span key={m.username} className={styles.tag}>
                    {m.username}
                  </span>
                );
              })}
          </section>

          <section>
            <h2 style={{ display: "flex" }}>
              Task:{" "}
              <a
                style={{
                  marginLeft: "auto",
                  fontSize: 14,
                  cursor: "pointer",
                }}
                onClick={addTask}
                className={styles.addTask}
              >
                Add Task
              </a>
            </h2>
            <DragList
              lists={{
                planTask: {
                  lists: projectDetail.planTask.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                  })),
                  status: taskStatus.planning,
                },
                developTask: {
                  lists: projectDetail.developTask.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                    status: taskStatus.developing,
                  })),
                  status: taskStatus.developing,
                },
                finishedTask: {
                  lists: projectDetail.finishedTask.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                  })),
                  status: taskStatus.finished,
                },
              }}
              onChange={moveTask}
              renderItem={(taskItem) => {
                return (
                  <div key={taskItem.id || taskItem._id}>
                    <h2>{taskItem.title}</h2>
                    <p>{taskItem.description}</p>
                    <p>Due Date: {taskItem.dueDate}</p>
                    <button onClick={() => navigate(`/task/${taskItem.id || taskItem._id}`)}>Check</button>
                  </div>
                );
              }}
            />
          </section>
        </div>
      ) : (
        <div />
      )}
    </Layout>
  );
};

export default ProjectDetailManageScreen;
