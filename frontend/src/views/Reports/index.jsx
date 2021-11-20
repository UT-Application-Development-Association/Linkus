import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../components/Permission";
import Layout from "../../components/Layout";
import {
  getAllReports,
  deleteReport as apiDeleteReport,
  ignoreReport as apiDismissReport,
} from "../../api/requets/report";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";

const ReportListScreen = () => {
  const [acctList, setAcctList] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserInfo()

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAllReports()
        .then((list) => setAcctList(list))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const deleteReport = (_id, idx) => {
    if (window.confirm("Are you sure you want to delete?")) {
      apiDeleteReport(_id)
      .then(() => {
        const newList = [...acctList];
        newList.splice(idx, 1);
        setAcctList(newList);
      })
      .catch(() => alert('Failed to delete'))
    }
  };

  const dismissReport = (_id, idx) => {
    if (window.confirm("Are you sure you want to ignore report?")) {
      apiDismissReport(_id)
      .then(() => {
        const newList = [...acctList];
        newList.splice(idx, 1);
        setAcctList(newList);
      })
      .catch(() => alert('Operation failed'))
    }
  }; 

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        <div className={styles.listPage}>
          <h1 className={styles.title}>All Reports</h1>

          {loading ? (
            <h2>Please wait...</h2>
          ) : (
            <div className={styles.accountList}>
              {(acctList && acctList.length > 0) ? acctList.map((report, idx) => {
                const { commenter, comment, task, _id, account } = report
                return (
                  <div className={styles.listItem} key={idx}>
                    <div>
                    <img src={commenter.avatar} alt="avatar" />
                    <h3 className={styles.name}>{commenter.name}</h3>
                    </div>
                    <div style={{ marginLeft: 24 }}>
                      <h2>{comment.comment}</h2>
                    </div>
                    <div className={styles.actionBtn}>
                      <Button type="btn-primary" onClick={() => dismissReport(_id, idx)}>
                        Dismiss
                      </Button>
                      <Button type="danger" onClick={() => deleteReport(_id, idx)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              }) : <h2 style={{ textAlign: 'center' }}>No report found</h2>}
            </div>
          )}
        </div>
      </Permission>
    </Layout>
  );
};

export default ReportListScreen;
